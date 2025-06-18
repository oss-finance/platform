from app.services.rag_service import RAGService

# Note: The docstrings here are CRITICAL. The AI agent reads them
# to understand what the tool does and how to use it.

def get_stock_price(ticker: str) -> float:
    """Returns the latest stock price for a given ticker symbol."""
    print(f"TOOL USED: Getting stock price for {ticker}")
    # ... code to call Financial Modeling Prep API ...
    return 123.45

def search_recent_news(query: str) -> str:
    """Searches the web for recent news and information on a given query."""
    print(f"TOOL USED: Searching web for {query}")
    # ... code to call Tavily AI or another search API ...
    return "Recent news summary..."

def search_internal_knowledge(query: str, rag_service: RAGService) -> str:
    """
    Searches the internal knowledge base of books, articles, and personal
    notes. Use this for historical context or deep analysis.
    """
    print(f"TOOL USED: Searching internal knowledge for {query}")
    # This tool uses the RAGService
    return rag_service.search_knowledge(query, user_id="...") 