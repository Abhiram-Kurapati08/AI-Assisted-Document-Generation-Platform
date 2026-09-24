# Draftly

Draftly is an AI-assisted document authoring app. Users can create projects, generate and refine sections, and export documents as Word, PowerPoint, and plain text.

## Deploy with Docker Compose

Requirements: Docker Engine with the Compose plugin. Copy the environment template:

```sh
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env`. Generate `SECRET_KEY` with `python -c "import secrets; print(secrets.token_urlsafe(48))"` and set `DB_PASSWORD` to a strong alphanumeric password. The example leaves both blank so Compose refuses to start until you fill them in. `SECRET_KEY` must contain at least 32 characters.

Start the stack:

```sh
docker compose up --build -d
```

Open `http://localhost:8080`. The frontend and API share one origin, the API waits for PostgreSQL, and Alembic applies pending migrations before the API starts. Check the stack with `docker compose ps` and API logs with `docker compose logs -f api`. Health is at `/health` and interactive API documentation is at `/docs`.

For a hosted deployment, terminate HTTPS at a trusted reverse proxy or load balancer. Set `CORS_ORIGINS` to the exact public frontend origin(s), without trailing slashes, and configure `APP_PORT` as needed. The supported `LLM_PROVIDER` values are `ollama` and `gemini`. Ollama defaults to `http://host.docker.internal:11434`; ensure the model is available and Ollama is reachable from the container. For Gemini, set `LLM_PROVIDER=gemini` and supply `GEMINI_API_KEY`. If the selected provider is misconfigured, the API still starts and generation returns a service unavailable response.

PostgreSQL data is stored in the `postgres_data` Docker volume. Back it up before upgrades. Apply schema changes through new Alembic migrations.

## Run locally without Docker

Requirements: Python 3.10+, Node.js 20+, and PostgreSQL.

### Backend

```sh
cd Backend
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Create `Backend/.env` with a PostgreSQL URL and generated signing key:

```env
DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/document_ai
SECRET_KEY=replace-this-with-the-generated-random-secret
CORS_ORIGINS=http://localhost:5173
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
# For Gemini, set LLM_PROVIDER=gemini and GEMINI_API_KEY=your_key
```

Run migrations and start the API:

```sh
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```sh
cd frontend
npm ci
```

Create `frontend/.env.local` with `VITE_API_URL=http://127.0.0.1:8000`, then run `npm run dev` and open `http://localhost:5173`.

## Checks

Run `npm ci && npm run build` in `frontend`. In `Backend`, install test dependencies with `pip install -r requirements-dev.txt` and run `alembic upgrade head`, `python scripts/smoke_health.py`, and `pytest -q`. GitHub Actions runs these checks against a fresh PostgreSQL 16 service and builds the frontend for every push and pull request.

The backend tests cover authentication, refresh rotation and logout revocation, expired and invalid JWTs, cross-user project read/update/delete attempts, section editing and revision creation, and DOCX/PPTX/TXT exports.

## Stack

- Frontend: React, TypeScript, Vite, Axios
- API: FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL
- AI: Ollama and Gemini adapters
