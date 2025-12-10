# Thryve App


AI-powered fitness tracking application with workout management, progress
tracking, and intelligent coaching.


## Tech Stack


- **Backend:** Spring Boot 3.x, Java 17, PostgreSQL, Redis
- **Frontend:** React 18, Javascript
- **Infrastructure:** Docker, Docker Compose


## Prerequisites


- Java 17+
- Node.js 18+
- Docker & Docker Compose


## Quick Start


### Development Setup


1. Start databases:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```


2. Start backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```


3. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```


### Full Docker Setup


```bash
docker-compose up --build
```


## Access


- Frontend: http://localhost:3000 (Docker) or http://localhost:5173 (dev)
- Backend API: http://localhost:8080/api/v1
- API Health: http://localhost:8080/api/v1/health
