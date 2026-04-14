"""
FastAPI entry point for the CodeLabz Agentic AI service.

Endpoints
---------
POST /chat
    Accept a student query and return the AI assistant's response.

POST /index
    Index new CodeLabz lab documents into ChromaDB.

GET  /health
    Liveness probe.

Environment variables (see .env.sample)
----------------------------------------
OPENAI_API_KEY      – required
OPENAI_MODEL        – optional, default gpt-4o-mini
CHROMA_PERSIST_DIR  – optional, default ./chroma_db
RAG_TOP_K           – optional, default 4
FIREBASE_CRED_PATH  – optional path to Firebase service-account JSON
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import List, Optional

import firebase_admin
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import credentials, firestore
from langchain_core.messages import HumanMessage
from pydantic import BaseModel

from ai_agent.agent_state import AgentState
from ai_agent.graph import run
from ai_agent.vector_store import VectorStoreManager

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Firebase initialisation (optional – only when FIREBASE_CRED_PATH is set)
# ---------------------------------------------------------------------------

_db: Optional[object] = None


def _init_firebase() -> None:
    global _db
    cred_path = os.getenv("FIREBASE_CRED_PATH")
    if cred_path and not firebase_admin._apps:
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            _db = firestore.client()
            logger.info("Firebase initialised successfully.")
        except Exception as exc:
            logger.warning("Firebase initialisation failed: %s", exc)


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    _init_firebase()
    yield


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="CodeLabz Agentic AI",
    description="LangGraph-powered multi-agent assistant for CodeLabz.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------


class ChatRequest(BaseModel):
    message: str
    lab_id: str = ""
    current_code_snippet: str = ""
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    retrieved_kb_docs: List[str] = []
    conversation_id: Optional[str] = None


class IndexRequest(BaseModel):
    documents: List[str]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Run the LangGraph agent workflow for a single student turn."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="message must not be empty")

    initial_state: AgentState = {
        "messages": [HumanMessage(content=request.message)],
        "next_step": "",
        "is_finished": False,
        "lab_id": request.lab_id,
        "current_code_snippet": request.current_code_snippet,
        "retrieved_kb_docs": [],
    }

    try:
        final_state: AgentState = run(initial_state)
    except Exception as exc:
        logger.exception("Agent workflow raised an error: %s", exc)
        raise HTTPException(status_code=500, detail="Agent error") from exc

    ai_messages = [
        m for m in final_state["messages"] if m.type == "ai"
    ]
    reply = ai_messages[-1].content if ai_messages else "Sorry, I could not generate a response."

    # Persist conversation turn to Firestore when available
    conversation_id = request.conversation_id
    if _db and request.lab_id:
        try:
            conversation_id = _persist_turn(
                db=_db,
                lab_id=request.lab_id,
                conversation_id=conversation_id,
                user_message=request.message,
                ai_reply=reply,
            )
        except Exception as exc:
            logger.warning("Firestore persistence failed: %s", exc)

    return ChatResponse(
        reply=reply,
        retrieved_kb_docs=final_state.get("retrieved_kb_docs", []),
        conversation_id=conversation_id,
    )


@app.post("/index")
async def index_documents(request: IndexRequest):
    """Add documents to the ChromaDB knowledge-base."""
    if not request.documents:
        raise HTTPException(status_code=400, detail="documents list must not be empty")

    manager = VectorStoreManager()
    manager.index_documents(request.documents)
    return {"indexed": len(request.documents)}


# ---------------------------------------------------------------------------
# Firestore persistence helper
# ---------------------------------------------------------------------------


def _persist_turn(
    db,
    lab_id: str,
    conversation_id: Optional[str],
    user_message: str,
    ai_reply: str,
) -> str:
    """Write a conversation turn to Firestore and return the conversation id."""
    collection = db.collection("cl_ai_conversations")

    if conversation_id:
        doc_ref = collection.document(conversation_id)
    else:
        doc_ref = collection.document()
        conversation_id = doc_ref.id

    new_turns = [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": ai_reply},
    ]

    transaction = db.transaction()

    @firestore.transactional
    def append_turns_in_transaction(txn, reference) -> None:
        snapshot = reference.get(transaction=txn)
        existing_turns = []
        if snapshot.exists:
            existing_turns = snapshot.to_dict().get("turns", [])

        txn.set(
            reference,
            {
                "lab_id": lab_id,
                "turns": existing_turns + new_turns,
                "updated_at": firestore.SERVER_TIMESTAMP,
            },
            merge=True,
        )

    append_turns_in_transaction(transaction, doc_ref)
    return conversation_id
