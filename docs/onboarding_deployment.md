# Developer Onboarding & Deployment Guide

This document describes how to set up, test, run, and deploy the CHC Bharno Hospital Information System.

---

## 1. Prerequisites

Make sure you have installed:
- Node.js (v18 or above)
- Python (v3.12 or above)
- SQLite3 or PostgreSQL database engine
- Docker & Docker Compose (optional)

---

## 2. Local Setup Instructions

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create virtual environment and activate:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` file with appropriate credentials.
5. Apply Alembic migrations and seed data:
   ```bash
   alembic upgrade head
   python -m app.database.seed
   ```
6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```

### Frontend Setup
1. Navigate to root directory:
   ```bash
   cd ..
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
4. Access the portal at `http://localhost:5173`.

---

## 3. Production Deployment Architecture

We suggest hosting backend FastAPI within an isolated Docker container routed via Nginx proxy server.

### Example Nginx Reverse Proxy Config
```nginx
server {
    listen 80;
    server_name chc-bharno.in;

    location / {
        root /var/www/html/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
