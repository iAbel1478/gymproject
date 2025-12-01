# Use official Python runtime as a parent image
FROM python:3.11-slim

# Prevent Python from writing pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Create and set working directory
WORKDIR /app

# Install system dependencies (if needed for pandas/scikit-learn)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend ./backend

# Copy dataset into expected location for the backend
RUN mkdir -p backend/data
COPY data.csv ./backend/data/data.csv

# Expose the port FastAPI/uvicorn will run on
EXPOSE 8000

# Run the FastAPI application
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

#Running all of this as per rubric:

# docker build -t gym-occupancy:latest .
# docker run --rm -p 8000:8000 gym-occupancy:latest
# curl http://localhost:8000/docs