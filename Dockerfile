# Frontend is now hosted separately (tgarttattoo.hu via FTP).
# Stage below is kept for reference in case we revert to a monolithic setup.
#
# Stage 1: Build frontend
# FROM node:22-alpine AS frontend
# WORKDIR /build
# COPY frontend/package.json frontend/package-lock.json ./
# RUN npm ci
# COPY frontend/ .
# RUN npm run build

# Stage 2: Backend only
FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

RUN mkdir -p data uploads

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "run:app"]
