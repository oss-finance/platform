from fastapi import APIRouter, Depends
from app.models.schemas import PipelineRequest, PipelineResponse
from app.services.pipeline_service import PipelineService, get_pipeline_service

router = APIRouter()


@router.post("/execute", response_model=PipelineResponse)
async def execute_pipeline(
    request: PipelineRequest,
    pipeline_service: PipelineService = Depends(get_pipeline_service),
):
    """
    Execute a pipeline operation.

    Args:
        request: The pipeline request with action and parameters
        pipeline_service: The injected pipeline service instance

    Returns:
        PipelineResponse with status, message, and optional data
    """
    result = await pipeline_service.execute_pipeline(
        action=request.action,
        parameters=request.parameters,
    )

    return PipelineResponse(**result)


@router.get("/status/{pipeline_id}")
async def get_pipeline_status(
    pipeline_id: str,
):
    """
    Get the status of a specific pipeline.

    Args:
        pipeline_id: The ID of the pipeline to check

    Returns:
        Pipeline status information
    """
    # Placeholder implementation
    return {
        "pipeline_id": pipeline_id,
        "status": "running",
        "progress": 75,
        "message": "Pipeline is processing data",
    }
