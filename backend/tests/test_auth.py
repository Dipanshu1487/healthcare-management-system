import pytest
from httpx import AsyncClient
from app.core.security import hash_password

@pytest.mark.anyio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"

@pytest.mark.anyio
async def test_failed_login(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "nonexistent", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "Incorrect" in data["message"]
