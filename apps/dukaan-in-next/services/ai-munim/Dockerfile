# Dockerfile for DukaanMitra AI Munim (Cloud Run)
# Optimized for fast startup and production-ready performance

# --- Build Stage ---
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies in a wheel directory to keep final image small
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# --- Runtime Stage ---
FROM python:3.11-slim

WORKDIR /app

# Copy wheels from builder and install
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/* && rm -rf /wheels

# Copy application code
COPY . .

# Set up non-root user for security
RUN groupadd -r dukaan && useradd -r -g dukaan dukaan
USER dukaan

# Cloud Run uses PORT env variable
ENV PORT=8080
EXPOSE 8080

# Run the application with Gunicorn
# Using 1 worker and multiple threads for ML workloads to balance concurrency and memory
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
