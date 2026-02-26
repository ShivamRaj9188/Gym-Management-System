# Gym Management System

Full-stack gym operations platform with:
- Spring Boot REST API (`gym-backend`)
- React + Vite frontend (`gym-frontend`)
- PostgreSQL database

It covers member management, trainer assignment, attendance, plans, payments, dashboard analytics, and admin-controlled user verification.

## Tech Stack

- Backend: Java 17, Spring Boot 3.5.x, Spring Security, Spring Data JPA, Maven, JWT (`jjwt`)
- Frontend: React 19, React Router, Axios, Vite, Bootstrap 5
- Database: PostgreSQL

## Project Structure

```text
Gym Mangement system/
├── gym-backend/
├── gym-frontend/
├── PROJECT_REPORT.md
└── README.md
```

## Core Features

- JWT Authentication: login/signup with token-based access control
- User Verification Flow: new non-admin users require admin verification before login
- Admin User Management: list users, verify/unverify users, delete non-admin users
- Dashboard: total members, active members, trainers, attendance count, paid revenue
- Member + Plan Management: CRUD operations and member-plan linking
- Trainer Assignment: assign/unassign trainers to members
- Attendance Tracking: mark check-in/check-out and filter by member/date
- Payment Tracking: add payments, filter status/member, update payment status

## Authentication and Authorization

- Auth endpoints are public: `/api/auth/**`
- All other APIs require `Authorization: Bearer <jwt>`
- Admin APIs (`/api/admin/**`) require `ROLE_ADMIN`
- Frontend route guard supports both authenticated and admin-only routes (`ProtectedRoute`)

## Prerequisites

- Java 17+
- Node.js 18+ and npm
- PostgreSQL 14+ (or compatible)

## Backend Setup (`gym-backend`)

1. Create a PostgreSQL database:
```sql
CREATE DATABASE testdb;
```
2. Update DB configuration in `gym-backend/src/main/resources/application.yaml`:
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

3. Set a strong JWT secret in `application.yaml`:
- `jwt.secret`
- `jwt.expiration-ms`

4. Start backend:
```bash
cd gym-backend
./mvnw spring-boot:run
```

Backend URL: `http://localhost:9999`

## Seeded Data

On startup, the app seeds default data:
- Admin user: `admin` / `admin123` (BCrypt-encoded password)
- Plans: Basic, Premium, Elite
- Trainers: two sample trainers

## Frontend Setup (`gym-frontend`)

1. Install dependencies:
```bash
cd gym-frontend
npm install
```
2. Start dev server:
```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

Frontend API base URL is configured in `gym-frontend/src/services/api.js`:
- `http://localhost:9999/api`

## Main API Groups

- Auth: `/api/auth/*`
- Admin users: `/api/admin/users/*`
- Dashboard: `/api/home/dashboard`
- Members: `/api/members/*`
- Trainers: `/api/trainers/*`
- Plans: `/api/plans/*`
- Attendance: `/api/attendance/*`
- Payments: `/api/payments/*`

## Build for Production

Frontend:
```bash
cd gym-frontend
npm run build
```
Build output: `gym-frontend/dist`

Backend:
```bash
cd gym-backend
./mvnw clean package
```
Jar output: `gym-backend/target`

Run jar:
```bash
java -jar gym-backend/target/GymManagementSystem-0.0.1-SNAPSHOT.jar
```

## Current Notes

- CORS currently allows local frontend ports `5173` and `5174`
- JWT token is stored in browser `localStorage`
- API client auto-attaches token and logs user out on `401`
- `application.yaml` currently contains local DB credentials; move to env variables for deployment
