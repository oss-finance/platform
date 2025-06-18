from fastapi import APIRouter, Depends
from app.models.schemas import ExploreQueryRequest, AIResponse
from app.services.agent_service import AgentService, get_agent_service

router = APIRouter()


@router.post("/query", response_model=AIResponse)
async def handle_explore_query(
    request: ExploreQueryRequest,
    agent_service: AgentService = Depends(get_agent_service),
):
    """
    Receives a query from the frontend and passes it to the AgentService.

    Args:
        request: The explore query request containing the user's question
        agent_service: The injected agent service instance

    Returns:
        AIResponse with answer, confidence score, and evidence sources
    """
    result = await agent_service.run_query(
        query=request.query,
    )

    return AIResponse(**result)
