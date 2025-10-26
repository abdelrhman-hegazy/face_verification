# Face Verification

A Node.js-based face verification system using **ONNX models**, **PostgreSQL**, and **Express**.  
This project allows storing face embeddings in a database and comparing them for verification.

---

## Features

- Detect faces from images using ONNX models.
- Crop and preprocess face images automatically.
- Generate face embeddings.
- Save embeddings to PostgreSQL.
- Compare new embeddings with stored embeddings for verification.
- REST API endpoints for integration with frontend or other applications.

---

## Technology Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Face Models:** ONNX
- **Image Processing:** Sharp
- **File Storage:** Git LFS for large ONNX models

---

## Setup Instructions

## Docker
Build and run with Docker:

```bash
docker pull bnhegazy/face-verification .
docker run -p 3000:3000 --env-file .env bnhegazy/face-verification
---
```

### 1. Clone the repository
```bash

git clone https://github.com/abdelrhman-hegazy/face_verification.git
cd face_verification
npm install
git lfs install
git lfs pull
npm start

```


### .env
DATABASE=face_verification_db
USER=hegazy
PASSWORD=hegazypass
HOST=localhost
PORTDB=5432
SIMILARITY_THRESHOLD=0.8

### Setup PostgreSQL database

CREATE DATABASE face_verification_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  embedding float8[] NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  embedding_json jsonb
);

### API Endpoints
<img width="1024" height="591" alt="face_encode" src="https://github.com/user-attachments/assets/0d2f85bb-0f0a-46a1-877c-e94ac5b7df33" />
<img width="1033" height="586" alt="compare" src="https://github.com/user-attachments/assets/0f1d6fc8-189c-4355-8c97-e932249948d8" />

#### POST /compare
Description: Compare a new face image with the stored embedding.

Form Data:
username → string
image → image file

Response:
```bash
{
  "success": true,
  "isMatch": true,
  "similarity": 0.92
}

```
#### POST /save-embedding

Description: Save a new user embedding.
Body:
```bash
{
  "username": "john",
  "embedding": [0.12, 0.54, ...]
}
```



