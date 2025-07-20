# Use an official Python runtime
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app# Use a prebuilt image with dlib and face_recognition preinstalled
FROM facegenius/face_recognition:latest

# Set working directory
WORKDIR /app

# Copy requirements file and install only remaining Python dependencies
COPY requirements.txt .

# Remove dlib and face_recognition from requirements.txt if they exist
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy your project files
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Start the Django app using Gunicorn
CMD ["gunicorn", "qr_backend.wsgi:application", "--bind", "0.0.0.0:8000"]


# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    python3-dev \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run server
CMD ["gunicorn", "qr_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
