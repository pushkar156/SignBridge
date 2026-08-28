# Dockerfile for SignBridge Flask Backend & ML Engine
FROM python:3.11-slim

# Install system dependencies required by OpenCV and MediaPipe
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsm6 \
    libxext6 \
    libgl1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code and models
COPY backend/ ./backend/
COPY Procfile .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

EXPOSE 5000

# Run Flask backend server using Gunicorn
CMD ["gunicorn", "--chdir", "backend", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120"]
