"""
LangGraph workflow for the CodeLabz Agentic Framework.

Graph topology
--------------

    ┌──────────┐
    │  router  │  (classifies the latest message)
    └────┬─────┘
         │
    ─────┼──────────────────────────────────────
    │              │               │
    ▼              ▼               ▼
documentation  debugging       respond
    │              │               │
    └──────────────┴───────────────┘
                   │
               respond  (synthesises / passes through)
                   │
                 END

The Router conditionally branches to one of three nodes based on the
``next_step`` value it writes into ``AgentState``.  Both specialist agents
set ``is_finished = True`` and write a final ``AIMessage``, so the Responder
node at the end becomes a no-op pass-through in those paths.
"""

from langgraph.graph import END, StateGraph

from ai_agent.agent_state import AgentState
from ai_agent.agents.debugging_agent import debug
from ai_agent.agents.documentation_agent import answer
from ai_agent.agents.responder import respond
from ai_agent.agents.router import route

# ---------------------------------------------------------------------------
# Build the graph
# ---------------------------------------------------------------------------

_builder = StateGraph(AgentState)

# Add nodes
_builder.add_node("router", route)
_builder.add_node("documentation", answer)
_builder.add_node("debugging", debug)
_builder.add_node("respond", respond)

# Entry point
_builder.set_entry_point("router")

# Conditional routing based on the ``next_step`` field written by the Router
_builder.add_conditional_edges(
    "router",
    lambda state: state["next_step"],
    {
        "documentation": "documentation",
        "debugging": "debugging",
        "respond": "respond",
    },
)

# After specialist agents finish, always pass through the Responder
_builder.add_edge("documentation", "respond")
_builder.add_edge("debugging", "respond")

# Responder is the terminal node
_builder.add_edge("respond", END)

# Compile once at import time
graph = _builder.compile()


def run(state: AgentState) -> AgentState:
    """Execute the full agent workflow and return the updated state."""
    return graph.invoke(state)
