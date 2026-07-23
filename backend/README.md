# CHC Bharno Hospital Information System (HIS) Backend

Enterprise backend foundation built with FastAPI, PostgreSQL, SQLAlchemy 2.0 (async), Alembic, and Docker.

---

## 🏗️ Folder Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── auth/          # Login & Credential management
│   │       ├── admin/         # IT Support & Security Center
│   │       ├── patients/      # Patient registrations & profiles
│   │       ├── doctors/       # Consultations queue & records
│   │       ├── appointments/  # OPD token slots & checks
│   │       ├── laboratory/    # Pathology orders & results
│   │       ├── pharmacy/      # Prescription processing & inventory
│   │       ├── billing/       # Invoices & PM-JAY claims
│   │       └── dashboard/     # Operations statistics
│   ├── core/                  # Security policy, configs, exceptions
│   ├── database/              # SQLAlchemy engine, declarative Base, dependencies
│   ├── utils/                 # Response envelopers & formatting utilities
│   └── main.py                # App entrypoint
├── alembic/                   # Database schema migrations environment
├── requirements.txt           # Active dependencies list
├── Dockerfile                 # Docker container config
├── docker-compose.yml         # Container orchestration
└── README.md
```

---

## ⚙️ Prerequisites & Installation

1. Install Python 3.12+ and PostgreSQL locally.
2. Initialize virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy env file and adjust config details:
   ```bash
   cp .env.example .env
   ```

---

## 🚀 Running Locally

Start the uvicorn development server:
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative ReDoc documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🐳 Docker Deployment

To launch the backend stack (FastAPI web app + PostgreSQL database container) orchestrating volume mounts locally:
```bash
docker compose up --build
```
- FastAPI web service runs at [http://localhost:8000](http://localhost:8000)
- Database container listens on port `5432` internally.

---

## 🗄️ Database Migrations (Alembic)

1. Generate initial migration script based on models:
   ```bash
   alembic revision --autogenerate -m "Initial schema setup"
   ```
2. Apply migrations to database:
   ```bash
   alembic upgrade head
   ```
