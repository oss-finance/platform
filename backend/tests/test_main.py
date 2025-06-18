from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy", 
        "message": "OSS Finance Platform API is running"
    }

def test_explore_query():
    """Test the explore query endpoint."""
    response = client.post(
        "/api/v1/explore/query",
        json={"query": "What is the stock price of AAPL?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer_text" in data
    assert "confidence_score" in data
    assert "confidence_justification" in data
    assert "evidence_sources" in data
