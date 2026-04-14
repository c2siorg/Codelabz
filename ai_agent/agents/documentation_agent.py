"""Documentation Agent for the CodeLabz Agentic Framework.

This agent performs Retrieval-Augmented Generation (RAG) over the CodeLabz
knowledge-base stored in ChromaDB.  It:

1. Retrieves the *k* most-relevant passages for the student's question.
2. Stores the passages in ``retrieved_kb_docs`` for transparency / citation.
3. Generates a grounded answer and appends it to ``messages``.
"""

import logging
import os
from typing import Any

from langchain_core.messages import AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

from ai_agent.agent_state import AgentState
from ai_agent.vector_store import VectorStoreManager

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are the Documentation Expert for the CodeLabz learning platform.

Answer the student's question using ONLY the context passages provided below.
If the answer cannot be found in the context, say so honestly and suggest where
the student might look next.

Be concise, use examples when helpful, and format code with markdown fences.
"""

_vector_store: VectorStoreManager | None = None


def _get_vector_store() -> VectorStoreManager:
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStoreManager()
    return _vector_store


def answer(state: AgentState) -> dict[str, Any]:
    """LangGraph node: retrieve relevant docs and generate a grounded answer."""

    messages = state.get("messages", [])
    if not messages:
        return {}

    query = messages[-1].content
    store = _get_vector_store()

    retrieved: list[str] = store.similarity_search(
        query, k=int(os.getenv("RAG_TOP_K", "4"))
    )

    context_block = "\n\n---\n\n".join(retrieved) if retrieved else "(no context found)"

    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.3,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    system_with_context = (
        f"{_SYSTEM_PROMPT}\n\n"
        f"[Retrieved context]\n{context_block}"
    )

    response = llm.invoke(
        [SystemMessage(content=system_with_context)] + list(messages)
    )

    logger.debug(
        "Documentation agent answered using %d retrieved passage(s).", len(retrieved)
    )

    return {
        "messages": [AIMessage(content=response.content)],
        "retrieved_kb_docs": retrieved,
        "next_step": "respond",
        "is_finished": True,
    }
