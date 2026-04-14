"""
AgentState definition for the CodeLabz Agentic Framework.

This module defines the shared state object that flows through the
LangGraph multi-agent workflow, carrying the conversation history,
retrieved context, and control signals between agents.
"""

from typing import Annotated, List, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """
    State representation for the CodeLabz Agentic Framework.

    Fields
    ------
    messages:
        Full conversation history.  New messages are appended automatically
        via the ``add_messages`` reducer so callers never need to concat
        manually.
    next_step:
        The routing decision produced by the Router agent.
        Valid values: ``"documentation"``, ``"debugging"``, ``"respond"``.
    is_finished:
        Set to ``True`` by the Responder agent once a final answer has been
        written into *messages*.
    lab_id:
        Identifier of the currently active CodeLabz tutorial / lab.
    current_code_snippet:
        The code the student is working on, injected from the lab editor.
    retrieved_kb_docs:
        Passages retrieved from the ChromaDB knowledge-base by the
        Documentation agent and passed downstream for grounding.
    """

    messages: Annotated[List[BaseMessage], add_messages]
    next_step: str
    is_finished: bool
    lab_id: str
    current_code_snippet: str
    retrieved_kb_docs: List[str]
