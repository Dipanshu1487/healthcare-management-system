import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_get_doctor_availability_unauthorized(client: AsyncClient):
    # Try fetching slots without token
    response = await client.get("/api/v1/schedules/availability?doctor_id=be1e880c-98ea-454c-af28-6b9ce10c2f3d&target_date=2026-07-20")
    assert response.status_code == 401

@pytest.mark.anyio
async def test_book_appointment_unauthorized(client: AsyncClient):
    # Try booking without token
    response = await client.post(
        "/api/v1/schedules/appointments",
        json={
            "patient_id": "be1e880c-98ea-454c-af28-6b9ce10c2f3d",
            "doctor_id": "be1e880c-98ea-454c-af28-6b9ce10c2f3d",
            "target_date": "2026-07-20",
            "time_slot": "10:00 AM",
            "symptoms": "Headache"
        }
    )
    assert response.status_code == 401
