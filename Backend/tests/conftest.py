import os

os.environ.setdefault("SECRET_KEY", "integration-test-secret-key-must-be-at-least-32-chars")
os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("LLM_PROVIDER", "ollama")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app import models

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def user_factory(client):
    def create_user(email: str):
        response = client.post(
            "/auth/register",
            json={"email": email, "password": "DraftlyPass123"},
        )
        assert response.status_code == 201, response.text
        login = client.post(
            "/auth/login",
            data={"username": email, "password": "DraftlyPass123"},
        )
        assert login.status_code == 200, login.text
        return login.json()

    return create_user
