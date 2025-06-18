from fastapi import APIRouter, Depends
from app.models.schemas import PipelineRequest, PipelineResponse
from app.services.pipeline_service import PipelineService, get_pipeline_service

router = APIRouter()


@router.get("/", response_model=PipelineResponse)
async def get_pipelines(
    request: PipelineRequest,
    pipeline_service: PipelineService = Depends(get_pipeline_service),
):
    """
    Get all pipelines.

    Args:
        request: The pipeline request with action and parameters
        pipeline_service: The injected pipeline service instance

    Returns:
        PipelineResponse with status, message, and optional data
    """
    return PipelineResponse(
        status="success",
        message="Pipelines fetched successfully",
        data=[],
    )
