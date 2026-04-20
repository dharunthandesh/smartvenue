import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_get_crowd():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/crowd")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert "zone_name" in response.json()[0]

@pytest.mark.asyncio
async def test_get_queue():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/queue")
    assert response.status_code == 200
    assert "wait_time" in response.json()[0]

@pytest.mark.asyncio
async def test_admin_update():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/admin/update-crowd", json={"zone_id": "A1", "density": "high"})
    assert response.status_code == 200
    assert response.json()["message"] == "Zone A1 updated to high"
