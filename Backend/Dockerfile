# Lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system deps (only if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Cloud Run expects port 8080
ENV PORT=8080

# Run app (single worker is enough)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]