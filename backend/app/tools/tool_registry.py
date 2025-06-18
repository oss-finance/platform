from functools import partial
from app.tools.definitions import (
    get_stock_price,
    search_recent_news,
    search_internal_knowledge,
)
from app.services.rag_service import RAGService

def get_tools(rag_service: RAGService) -> list:
    """Assembles the list of tools available to the agent."""
    # We use `partial` to pass the rag_service instance into the tool
    # without the agent needing to know about it.
    internal_knowledge_tool = partial(search_internal_knowledge, rag_service=rag_service)
    # The docstring from the original function is preserved
    internal_knowledge_tool.__doc__ = search_internal_knowledge.__doc__

    return [
        get_stock_price,
        search_recent_news,
        internal_knowledge_tool,
    ] 