"""Router agent for the CodeLabz Agentic Framework.

The Router inspects the latest user message and the current lab context to
decide which specialist agent should handle the request next.

Possible ``next_step`` values
------------------------------
``"documentation"``
    Forward to the Documentation Agent (RAG over CodeLabz guides).
``"debugging"``
    Forward to the Debugging Agent (code analysis / fix suggestions).
``"respond"``
    The planner considers the state rich enough and asks the Responder to
    synthesise a final answer directly.
"""

import logging
import os
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from ai_agent.agent_state import AgentState

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are the Router for the CodeLabz AI assistant.

Your ONLY job is to classify the student's latest message into one of three
routing labels and reply with EXACTLY that label – nothing else.

Labels:
  documentation  – the student is asking a conceptual / how-to question that
                   can be answered from the CodeLabz tutorial guides.
  debugging      – the student has a code error, unexpected output, or wants
                   their code reviewed or fixed.
  respond        – the query is a simple greeting, thank-you, or something
                   that requires no specialist knowledge (answer directly).

Reply with one word only: documentation | debugging | respond
"""


def route(state: AgentState) -> dict[str, Any]:
    """Classify the student's latest message and set the routing decision.

    Parameters
    ----------
    state:
        The current ``AgentState``.  The function reads ``messages`` and
        ``current_code_snippet``.

    Returns
    -------
    dict
        A partial state update containing ``next_step`` set to one of
        ``"documentation"``, ``"debugging"``, or ``"respond"``.
    """

    messages = state.get("messages", [])
    if not messages:
        return {"next_step": "respond"}

    last_message = messages[-1]
    code_snippet = state.get("current_code_snippet", "")

    context_hint = ""
    if code_snippet:
        context_hint = f"\n\n[Student's current code snippet]\n```\n{code_snippet}\n```"

    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    routing_messages = [
        SystemMessage(content=_SYSTEM_PROMPT),
        HumanMessage(
            content=f"{last_message.content}{context_hint}"
        ),
    ]

    response = llm.invoke(routing_messages)
    decision = response.content.strip().lower()

    if decision not in {"documentation", "debugging", "respond"}:
        logger.warning(
            "Router returned unexpected label %r – defaulting to 'respond'.", decision
        )
        decision = "respond"

    logger.debug("Router decision: %s", decision)
    return {"next_step": decision}
