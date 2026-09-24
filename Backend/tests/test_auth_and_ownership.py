from datetime import timedelta
import asyncio
from types import SimpleNamespace

from app import models
from app.database import get_db
from app.main import app
from app.utils.jwt_utils import create_access_token
from app.config import settings
from app.llm.gemini_adapter import GeminiAdapter


def auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def create_project(client, token: str, title: str) -> str:
    response = client.post(
        "/projects/",
        headers=auth(token),
        json={"title": title, "doc_type": "docx", "topic_prompt": "Test project"},
    )
    assert response.status_code == 201, response.text
    return response.json()["id"]


def test_health_and_auth_lifecycle(client, user_factory):
    assert client.get("/health").status_code == 200
    tokens = user_factory("author@example.com")

    assert client.get("/projects/", headers=auth(tokens["access_token"])).status_code == 200

    refreshed = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert refreshed.status_code == 200
    assert client.get("/projects/", headers=auth(refreshed.json()["access_token"])).status_code == 200
    assert client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]}).status_code == 401

    logged_out = client.post(
        "/auth/logout", json={"refresh_token": refreshed.json()["refresh_token"]}
    )
    assert logged_out.status_code == 204
    assert client.post(
        "/auth/refresh", json={"refresh_token": refreshed.json()["refresh_token"]}
    ).status_code == 401

    # Refresh credentials must never authorize normal API requests.
    assert client.get("/projects/", headers=auth(tokens["refresh_token"])).status_code == 401
    # Access credentials must never be accepted by the refresh endpoint.
    assert client.post("/auth/refresh", json={"refresh_token": tokens["access_token"]}).status_code == 401


def test_invalid_and_expired_access_tokens_are_rejected(client, user_factory):
    tokens = user_factory("tokens@example.com")
    assert client.get("/projects/", headers=auth("not-a-jwt")).status_code == 401

    expired = create_access_token(
        {"sub": "00000000-0000-0000-0000-000000000000", "email": "expired@example.com"},
        expires_delta=timedelta(seconds=-1),
    )
    assert client.get("/projects/", headers=auth(expired)).status_code == 401
    assert client.post("/auth/refresh", json={"refresh_token": "not-a-jwt"}).status_code == 401


def test_cors_accepts_only_configured_origins(client):
    from app.config import settings

    allowed_origin = settings.CORS_ORIGINS.split(",")[0].strip()
    allowed = client.options(
        "/projects/",
        headers={
            "Origin": allowed_origin,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )
    assert allowed.headers.get("access-control-allow-origin") == allowed_origin

    rejected = client.options(
        "/projects/",
        headers={
            "Origin": "https://attacker.invalid",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert "access-control-allow-origin" not in rejected.headers


def test_users_cannot_access_each_others_projects(client, user_factory):
    user_a = user_factory("user-a@example.com")
    user_b = user_factory("user-b@example.com")
    project_a = create_project(client, user_a["access_token"], "Private project A")
    project_b = create_project(client, user_b["access_token"], "Private project B")

    # The owner can read their project, while another authenticated user gets 404.
    assert client.get(f"/projects/{project_a}", headers=auth(user_a["access_token"])).status_code == 200
    assert client.get(f"/projects/{project_b}", headers=auth(user_a["access_token"])).status_code == 404
    assert client.put(
        f"/projects/{project_b}", headers=auth(user_a["access_token"]), json={"title": "Stolen"}
    ).status_code == 404
    assert client.delete(f"/projects/{project_b}", headers=auth(user_a["access_token"])).status_code == 404


def test_document_exports_docx_pptx_and_txt(client, user_factory):
    tokens = user_factory("exporter@example.com")
    project_id = create_project(client, tokens["access_token"], "Export sample")
    section = client.post(
        f"/projects/{project_id}/sections/",
        headers=auth(tokens["access_token"]),
        json={"title": "Overview", "content": "Sample content", "idx": 0},
    )
    assert section.status_code == 201, section.text

    for export_format, signature in (
        ("docx", b"PK"),
        ("pptx", b"PK"),
        ("txt", b"Export sample"),
    ):
        response = client.get(
            f"/projects/{project_id}/export/?format={export_format}",
            headers=auth(tokens["access_token"]),
        )
        assert response.status_code == 200, response.text
        assert response.content.startswith(signature)


def test_edit_section_and_refine_saves_revision(client, user_factory, monkeypatch):
    class FakeProvider:
        async def generate_text(self, **_kwargs):
            return "AI refined content"

    monkeypatch.setattr(
        "app.services.section_service.get_llm_provider", lambda: FakeProvider()
    )
    tokens = user_factory("editor@example.com")
    project_id = create_project(client, tokens["access_token"], "Revision sample")
    headers = auth(tokens["access_token"])
    section_response = client.post(
        f"/projects/{project_id}/sections/",
        headers=headers,
        json={"title": "Overview", "content": "Original", "idx": 0},
    )
    assert section_response.status_code == 201, section_response.text
    section_id = section_response.json()["id"]

    edited = client.put(
        f"/projects/{project_id}/sections/{section_id}",
        headers=headers,
        json={"content": "Manually edited"},
    )
    assert edited.status_code == 200, edited.text
    assert edited.json()["content"] == "Manually edited"

    refined = client.post(
        f"/projects/{project_id}/sections/{section_id}/refine/",
        headers=headers,
        json={
            "prompt": "Keep the meaning and improve the flow",
            "refine_instruction": "Make this clearer and more professional",
            "temperature": 0.5,
            "max_tokens": 300,
        },
    )
    assert refined.status_code == 200, refined.text
    assert refined.json()["content"] == "AI refined content"

    db = next(app.dependency_overrides[get_db]())
    try:
        assert db.query(models.Revision).count() == 1
    finally:
        db.close()


def test_missing_provider_configuration_returns_503_without_crashing(client, user_factory, monkeypatch):
    def unavailable_provider():
        raise ValueError("provider credentials are missing")

    monkeypatch.setattr(
        "app.services.section_service.get_llm_provider", unavailable_provider
    )
    tokens = user_factory("no-provider@example.com")
    project_id = create_project(client, tokens["access_token"], "Provider unavailable")
    section = client.post(
        f"/projects/{project_id}/sections/",
        headers=auth(tokens["access_token"]),
        json={"title": "Overview", "content": "Draft content", "idx": 0},
    )
    assert section.status_code == 201, section.text
    response = client.post(
        f"/projects/{project_id}/sections/{section.json()['id']}/refine/",
        headers=auth(tokens["access_token"]),
        json={
            "prompt": "Keep the meaning and improve the flow",
            "refine_instruction": "Make this clearer and more professional",
            "temperature": 0.5,
            "max_tokens": 300,
        },
    )
    assert response.status_code == 503, response.text


def test_gemini_adapter_uses_configured_key_and_sdk(monkeypatch):
    captured = {}

    class FakeModels:
        def generate_content(self, **kwargs):
            captured.update(kwargs)
            return SimpleNamespace(text="Gemini response")

    class FakeClient:
        def __init__(self, api_key):
            assert api_key == "test-only-key"
            self.models = FakeModels()

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-only-key")
    monkeypatch.setattr("app.llm.gemini_adapter.genai.Client", FakeClient)
    adapter = GeminiAdapter()
    result = asyncio.run(adapter.generate_text("Write a short outline"))

    assert result == "Gemini response"
    assert captured["model"] == settings.GEMINI_MODEL
    assert captured["contents"] == "Write a short outline"
