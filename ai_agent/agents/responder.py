"""Responder agent for the CodeLabz Agentic Framework.

The Responder handles two scenarios:

1. **Direct reply** – The Router sent the query here because no specialist
   knowledge is required (greetings, thanks, etc.).
2. **Pass-through** – A specialist agent already wrote the final ``AIMessage``
   and set ``is_finished = True``.  In that case the Responder is a no-op.
"""

import logging
import os
from typing import Any

from langchain_core.messages import AIMessage, SystemMessage
from langchain_openai import ChatOpenAI

from ai_agent.agent_state import AgentState

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are the friendly assistant for the CodeLabz learning platform.

Answer the student's message in a warm, encouraging tone.
Keep replies short unless the student explicitly asks for a detailed explanation.
"""


def respond(state: AgentState) -> dict[str, Any]:
    """LangGraph node: generate a direct reply or pass through if already done."""

    if state.get("is_finished"):
        logger.debug("Responder: answer already written by specialist – passing through.")
        return {}

    messages = state.get("messages", [])
    if not messages:
        return {}

    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.5,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    response = llm.invoke(
        [SystemMessage(content=_SYSTEM_PROMPT)] + list(messages)
    )

    logger.debug("Responder wrote a direct reply.")

    return {
        "messages": [AIMessage(content=response.content)],
        "is_finished": True,
    }
