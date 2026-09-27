
# Project Title

A brief description of what this project does and who it's for

# Draftly

Draftly is an AI-assisted workspace for creating business documents and presentations. Start with an idea, let AI create an outline and first draft, refine each section, and export the finished work.

## Live demo

Try the deployed app: **[draftly-o5wf.onrender.com](https://draftly-o5wf.onrender.com/)**

## What you can do

- Create document or presentation projects in a private account workspace.
- Start from a template or describe what you want to make.
- Generate an outline and draft sections with AI.
- Edit sections manually or ask AI to generate and refine individual sections.
- Keep a revision history as AI updates are made.
- Download projects as DOCX, PPTX, or TXT files.

## How it works

1. Create an account and start a project.
2. Choose a document type, title, and prompt (or begin with a template).
3. Generate an outline and initial sections with the configured AI provider.
4. Review, edit, generate, or refine sections until the document is ready.
5. Export the result in the format you need.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Axios |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| AI providers | Google Gemini or Ollama |
| Exports | DOCX, PPTX, TXT |
| Local containers | Docker Compose |

## Run locally with Docker (recommended)

### Prerequisites

- Docker Engine with the Docker Compose plugin
- An AI provider: a Gemini API key, or a reachable Ollama instance with a downloaded model

### Start the project

1. Copy the sample environment file.

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env` instead.

2. Open `.env` and set these required values:

   ```env
   SECRET_KEY=use-a-random-string-with-at-least-32-characters
   DB_PASSWORD=use-a-strong-alphanumeric-password
   ```

   To generate a suitable `SECRET_KEY`, run:

   ```powershell
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```

3. Select an AI provider in `.env`:

   ```env
   # Option A: Gemini
   LLM_PROVIDER=gemini
   GEMINI_API_KEY=your-api-key

   # Option B: Ollama
   # LLM_PROVIDER=ollama
   # OLLAMA_BASE_URL=http://host.docker.internal:11434
   # OLLAMA_MODEL=llama3.2
   ```

4. Build and start the services.

   ```powershell
   docker compose up --build -d
   ```

5. Open [http://localhost:8080](http://localhost:8080).

Useful commands:

```powershell
docker compose ps
docker compose logs -f api
docker compose down
```

The API health endpoint is available at `http://localhost:8000/health` when the API is exposed directly by your environment. Docker stores database data in the `postgres_data` volume; keep a backup before making major upgrades.

## Run without Docker

### Prerequisites

- Python 3.10 or later
- Node.js 20 or later
- PostgreSQL
- A Gemini API key or a local Ollama installation

### 1. Set up the backend

```powershell
cd Backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `Backend/.env`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/document_ai
SECRET_KEY=replace-this-with-a-random-secret-of-at-least-32-characters
CORS_ORIGINS=http://localhost:5173

# Choose one provider
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-3.8-flash

# Or use Ollama instead
# LLM_PROVIDER=ollama
# OLLAMA_BASE_URL=http://127.0.0.1:11434
# OLLAMA_MODEL=llama3.2
```

Apply database migrations and start the API:

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

The API runs at [http://localhost:8000](http://localhost:8000), with interactive documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm ci
```

Create `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then start the app:

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Configuration reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Backend only | PostgreSQL connection URL. Docker Compose creates this automatically. |
| `SECRET_KEY` | Yes | Random key used to sign authentication tokens; minimum 32 characters. |
| `DB_PASSWORD` | Docker only | Password for the Compose PostgreSQL service. |
| `CORS_ORIGINS` | Production | Comma-separated frontend origin(s) allowed to call the API. |
| `LLM_PROVIDER` | Yes for AI generation | `gemini` or `ollama`. |
| `GEMINI_API_KEY` | Gemini only | API key for Google Gemini. |
| `OLLAMA_BASE_URL` | Ollama only | URL of the running Ollama server. |
| `OLLAMA_MODEL` | Ollama only | Name of the local Ollama model to use. |
| `APP_PORT` | Optional | Port exposed by the Docker web service; defaults to `8080`. |

## Project structure

```text
.
├── Backend/             # FastAPI API, database models, migrations, and exports
├── frontend/            # React application
├── docker-compose.yml   # Local PostgreSQL, API, and web services
├── .env.example         # Docker environment-variable template
└── DEMO_SCRIPT.md       # Suggested product demo flow
```

## Verify your changes

Run the frontend build:

```powershell
cd frontend
npm ci
npm run build
```

Run backend checks:

```powershell
cd Backend
pip install -r requirements-dev.txt
alembic upgrade head
python scripts/smoke_health.py
pytest -q
```

GitHub Actions runs the backend checks against PostgreSQL 16 and builds the frontend on every push and pull request.
