# Activity Hub Backend

Short overview of the backend service for Campus Activity Hub.

## Main Points

- Framework: Spring Boot 4.0.5
- Java: 25
- Port: 8080
- Data store: MySQL table `app_data` with JSON payloads per section
- API base path: /api
- CORS: enabled for frontend integration

## Backend Folder Structure

- src/main/java/com/campus/activityhub/ActivityHubApplication.java: app entry point
- src/main/java/com/campus/activityhub/controller: REST controllers
- src/main/java/com/campus/activityhub/service/DatabaseService.java: MySQL-backed JSON document service
- src/main/resources/application.properties: app config and MySQL connection settings
- src/main/resources/schema.sql: MySQL table definition
- src/main/resources/data.sql: demo seed data
- db.json: legacy seed snapshot kept for reference
- docker-compose.yml: local MySQL demo container
- pom.xml: Maven dependencies and build setup
- mvnw.cmd: Maven wrapper for Windows

## Prerequisites

- Java 25 installed
- MySQL 8.4 or compatible server
- Node frontend (optional for full-stack run)

## Setup

1. Start MySQL or run the local demo container:

```bash
docker compose up -d
```

2. Open terminal in this folder.
3. Ensure Java 25 is active.
4. Build once:

```bash
mvnw.cmd clean compile
```

## Run Backend

```bash
mvnw.cmd spring-boot:run
```

Backend URL:

- http://localhost:8080

Database connection defaults:

- URL: jdbc:mysql://localhost:3306/activity_hub_demo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
- Username: activityhub
- Password: activityhub

Quick checks:

- GET / returns service status JSON
- GET /test returns backend health message

## Major Endpoints

Health

- GET /
- GET /test

Auth

- POST /api/auth/login
- POST /api/auth/register

Activities

- GET /api/activities
- GET /api/activities/{id}
- POST /api/activities
- PUT /api/activities/{id}
- DELETE /api/activities/{id}

Registrations

- GET /api/registrations
- POST /api/registrations
- DELETE /api/registrations/{id}

Notifications

- GET /api/notifications?audience=student|admin
- POST /api/notifications
- PATCH /api/notifications/{id}/read

## Frontend Integration

If frontend is running with Vite proxy, API calls from frontend /api routes are forwarded to this backend on port 8080.

## Demo Credentials

- Admin: admin@campus.com / 123456
- Student: ava@campus.com / 123456
