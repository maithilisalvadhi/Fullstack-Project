# Activity Hub Backend

Short overview of the backend service for Campus Activity Hub.

## Main Points

- Framework: Spring Boot 4.0.5
- Java: 25
- Port: 8080
- Data store: local JSON file at db.json
- API base path: /api
- CORS: enabled for frontend integration

## Backend Folder Structure

- src/main/java/com/campus/activityhub/ActivityHubApplication.java: app entry point
- src/main/java/com/campus/activityhub/controller: REST controllers
- src/main/java/com/campus/activityhub/service/DatabaseService.java: JSON file read/write service
- src/main/resources/application.properties: app config
- db.json: local data for users, activities, registrations, notifications
- pom.xml: Maven dependencies and build setup
- mvnw.cmd: Maven wrapper for Windows

## Prerequisites

- Java 25 installed
- Node frontend (optional for full-stack run)

## Setup

1. Open terminal in this folder.
2. Ensure Java 25 is active.
3. Build once:

```bash
mvnw.cmd clean compile
```

## Run Backend

```bash
mvnw.cmd spring-boot:run
```

Backend URL:

- http://localhost:8080

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
