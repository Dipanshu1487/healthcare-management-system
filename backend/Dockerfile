# ==============================
# Build Stage
# ==============================
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definition
COPY requirements.txt .

# Install Python dependencies into a dedicated directory
RUN pip install --no-cache-dir \
    --prefix=/install \
    -r requirements.txt


# ==============================
# Production Runtime Stage
# ==============================
FROM python:3.12-slim AS runner

WORKDIR /workspace

# Install runtime PostgreSQL library
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=builder /install /usr/local

# Create non-root application user
RUN useradd \
    --create-home \
    --uid 10001 \
    appuser

# Create required directories
RUN mkdir -p /workspace/uploads /workspace/logs && \
    chown -R appuser:appuser /workspace

# Copy backend application
COPY --chown=appuser:appuser . .

# Run application as non-root user
USER appuser

# Application port
EXPOSE 8000

# Container health check
HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1

# Start FastAPI
CMD ["sh", "-c", "alembic upgrade head && python -m app.database.seed && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]