## Journal Assistant

This repo now contains:

- `frontend/`: the Next.js frontend
- `backend/`: a separate FastAPI backend

## Frontend

The frontend now lives in `frontend/` and follows an MVVM-style structure:

- `frontend/src/modules/*/models`: feature data types and mock/domain data
- `frontend/src/modules/*/view-models`: React Query hooks and screen state
- `frontend/src/modules/*/views`: screen rendering
- `frontend/src/shared/*`: shell, shared UI, providers, and utilities

Run the Next.js app:

```bash
cd frontend
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Backend

The backend lives in `backend/` and uses `fastapi[standard]`, which includes the FastAPI Cloud CLI.

Install backend dependencies and run it locally:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
fastapi dev
```

The API will start locally with:

- `GET /` returning a simple message
- `GET /health` returning a health check response

## FastAPI Cloud

To deploy the backend with FastAPI Cloud:

```bash
cd backend
fastapi deploy
```

If you connect this repository directly in FastAPI Cloud as a monorepo, set the application directory to `backend` in the FastAPI Cloud dashboard.

The backend entrypoint is `backend/main.py`, which matches FastAPI Cloud's default project detection.
