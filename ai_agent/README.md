# CodeLabz Agentic AI Framework

A LangGraph-powered multi-agent assistant that guides CodeLabz students through
coding labs, suggests fixes, and summarises documentation in real-time.

## Architecture

```
Student message
       │
    ┌──▼──────┐
    │ Router  │  classifies intent → documentation | debugging | respond
    └──┬──────┘
       │
  ─────┼──────────────────────────
  │              │           │
  ▼              ▼           ▼
Documentation  Debugging  Respond
 Agent (RAG)   Agent      (direct)
  │              │           │
  └──────────────┴───────────┘
                 │
             Responder
             (final answer)
```

| Agent | Purpose |
|---|---|
| **Router** | Classifies the latest student message into one of three routing labels |
| **Documentation Agent** | RAG over ChromaDB-indexed CodeLabz guides |
| **Debugging Agent** | Static code analysis & fix suggestions |
| **Responder** | Synthesises or passes through the final reply |

## Prerequisites

- Python 3.11+
- An [OpenAI API key](https://platform.openai.com/api-keys)
- (Optional) A Firebase service-account JSON for conversation persistence

## Setup

```bash
cd ai_agent
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.sample .env                # fill in your secrets
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key |
| `OPENAI_MODEL` | ❌ | `gpt-4o-mini` | Chat model to use |
| `CHROMA_PERSIST_DIR` | ❌ | `./chroma_db` | Path for ChromaDB persistence |
| `RAG_TOP_K` | ❌ | `4` | Number of passages to retrieve |
| `FIREBASE_CRED_PATH` | ❌ | — | Path to Firebase service-account JSON |
| `ALLOWED_ORIGINS` | ❌ | `*` | Comma-separated CORS origins |

## Running the service

```bash
uvicorn ai_agent.main:app --reload --port 8000
```

The service exposes three endpoints:

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `POST` | `/chat` | Student chat turn |
| `POST` | `/index` | Index new lab documents |

### Example `/chat` request

```json
POST /chat
{
  "message": "Why does my for-loop give an IndexError?",
  "lab_id": "intro-python-lab-1",
  "current_code_snippet": "for i in range(len(arr) + 1):\n    print(arr[i])",
  "conversation_id": null
}
```

## Indexing lab documents

```bash
curl -X POST http://localhost:8000/index \
  -H "Content-Type: application/json" \
  -d '{"documents": ["## Variables\nIn Python a variable is created the moment you assign a value to it..."]}'
```

## Project structure

```
ai_agent/
├── __init__.py
├── agent_state.py          # AgentState TypedDict
├── graph.py                # LangGraph workflow
├── main.py                 # FastAPI entry point
├── vector_store.py         # ChromaDB wrapper
├── requirements.txt
├── .env.sample
└── agents/
    ├── __init__.py
    ├── router.py            # Router agent
    ├── documentation_agent.py  # RAG agent
    ├── debugging_agent.py   # Debugging agent
    └── responder.py         # Responder agent
```

## Roadmap

| Version | Feature |
|---|---|
| **v1.0** | Connect LangGraph to Firebase/Firestore for conversation persistence |
| **v1.1** | Index all CodeLabz markdown guides into ChromaDB for context-aware support |
| **v1.2** | Split into specialised agents: Planner, Tool-User, Responder |
| **v1.3** | Add sandboxed code execution to verify debugging suggestions |
