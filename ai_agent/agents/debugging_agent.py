"""Debugging Agent for the CodeLabz Agentic Framework.

This agent analyses the student's code snippet, interprets error messages,
and produces actionable fix suggestions.  It does NOT execute arbitrary code;
instead it uses a language model with a code-focused system prompt to reason
about the problem statically.

For future versions (v1.2+) this agent can be extended with a sandboxed
code-execution tool (e.g. via LangChain's ``PythonREPLTool`` or a Docker
sandbox) to verify proposed fixes.
"""

import logging
import os
from typing import Any

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from ai_agent.agent_state import AgentState

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are the Debugging Expert for the CodeLabz learning platform.

Your job is to help students fix their code.  When analysing a problem:

1. Identify the root cause of the error or unexpected behaviour.
2. Explain *why* it happens in simple terms.
3. Provide a corrected code snippet inside a markdown fence.
4. Mention any related best-practices the student should know.

If no code snippet is available, ask the student to share the relevant code.
"""


def debug(state: AgentState) -> dict[str, Any]:
    """LangGraph node: analyse the student's code and suggest a fix."""

    messages = state.get("messages", [])
    code_snippet = state.get("current_code_snippet", "")

    if not messages:
        return {}

    extra: list = []
    if code_snippet:
        extra.append(
            HumanMessage(
                content=(
                    f"Here is the student's current code snippet:\n"
                    f"```\n{code_snippet}\n```"
                )
            )
        )

    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.2,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    response = llm.invoke(
        [SystemMessage(content=_SYSTEM_PROMPT)] + extra + list(messages)
    )

    logger.debug("Debugging agent produced a response.")

    return {
        "messages": [AIMessage(content=response.content)],
        "next_step": "respond",
        "is_finished": True,
    }
