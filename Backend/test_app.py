import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_steps_endpoint():
    # Test valid request
    response = client.post("/steps", json={"text": "I am 18 years old"})
    assert response.status_code == 200
    assert "steps" in response.json()
    assert isinstance(response.json()["steps"], list)

    # Test validation (too short)
    response = client.post("/steps", json={"text": ""})
    assert response.status_code == 422

def test_explain_endpoint():
    response = client.post("/explain", json={"text": "Voter Registration"})
    assert response.status_code == 200
    assert "explanation" in response.json()

def test_chat_endpoint():
    response = client.post("/chat", json={"text": "How do I get a voter ID?"})
    assert response.status_code == 200
    assert "reply" in response.json()

def test_rate_limiting():
    # Rapid requests to trigger rate limit (if set low for testing)
    # This might need adjustment based on the actual RATE_LIMIT value
    for _ in range(25):
        client.post("/steps", json={"text": "test"})
    
    response = client.post("/steps", json={"text": "test"})
    # Since we set limit to 20 in app.py
    assert response.status_code == 429
