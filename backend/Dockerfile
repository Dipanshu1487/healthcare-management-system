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

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


# ==============================
# Runtime Stage
# ==============================
FROM python:3.12-slim AS runner

WORKDIR /workspace

# Install runtime libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /usr/local /usr/local

# Create non-root user
RUN useradd -m -u 10001 appuser

# Create application directories
RUN mkdir -p /workspace/uploads /workspace/logs && \
    chown -R appuser:appuser /workspace

# Copy application source
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Railway uses a dynamic port
EXPOSE 8000

# Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1

# Start FastAPI
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]