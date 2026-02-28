# Gym Management System

**🚀 Live Demo:** [https://gym-management-system-blond.vercel.app](https://gym-management-system-blond.vercel.app)
**⚙️ Backend API:** `https://gym-backend-production-2509.up.railway.app`

Full-stack gym operations platform with:
- Spring Boot REST API (`gym-backend`) deployed on **Railway**
- React + Vite frontend (`gym-frontend`) deployed on **Vercel**
- PostgreSQL database hosted on **Supabase**

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
├── .gitignore
├── PROJECT_REPORT.md
└── README.md
```

## Core Features

- **Security & Auth:** JWT Authentication with Refresh Tokens, Rate Limiting, and XSS Sanitization.
- **User Verification Flow:** New non-admin users require admin verification before login.
- **Admin User Management:** List users, verify/unverify users, delete non-admin users.
- **Dashboard:** Total members, active members, trainers, attendance count, paid revenue.
- **Member + Plan Management:** CRUD operations and member-plan linking.
- **Trainer Assignment:** Assign/unassign trainers to members.
- **Attendance Tracking:** Mark check-in/check-out and filter by member/date.
- **Payment Tracking:** Add payments, filter status/member, update payment status.
- **Global Error Handling:** Consistent API error envelopes across all endpoints.

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
2. Configure DB credentials (choose one):
- **Environment variables** (recommended): set `DB_USERNAME` and `DB_PASSWORD`
- **Direct config**: edit `gym-backend/src/main/resources/application.yaml` → `spring.datasource.username` / `password`

3. Configure JWT secret (choose one):
- **Environment variable** (recommended): set `JWT_SECRET`
- **Direct config**: edit `jwt.secret` in `application.yaml`

4. Start backend:
```bash
cd gym-backend
./mvnw spring-boot:run
```

Backend URL: `http://localhost:9999`

### Database Alignment Migration (auto-runs)

This repo includes an idempotent alignment script at:
- `gym-backend/src/main/resources/db/schema-alignment.sql`

It runs automatically on backend startup (configured in `application.yaml`) and keeps DB schema/data aligned with validations:
- drops legacy `member.plan_type` if present
- normalizes/repairs invalid member/trainer email/phone data for old databases
- enforces `NOT NULL` for required member/trainer fields
- creates unique indexes for member/trainer `email` and `phone`
- adds payment check constraints for valid status/method and due-date consistency

So after cloning and running backend, a fresh or older DB is aligned automatically.

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

## Build and Deploy for Production

### Architecture
- **Frontend** is hosted statically on **Vercel**.
- **Backend** is deployed as a Dockerized service on **Railway**.
- **Database** is a robust connection-pooled PostgreSQL instance on **Supabase**.

### Environment Variables Required
**Backend (Railway):**
- `SPRING_DATASOURCE_URL`: Supabase JDBC URL (`jdbc:postgresql://...`)
- `DB_USERNAME` & `DB_PASSWORD`: Supabase credentials
- `JWT_SECRET`: Secure 256-bit+ secret key
- `CORS_ORIGINS`: `https://gym-management-system-blond.vercel.app`

**Frontend (Vercel):**
- `VITE_API_URL`: `https://gym-backend-production-2509.up.railway.app/api`

### Local Production Build
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

## Current Notes

- CORS is strictly configured to allow Vercel origins and local dev (`5173`).
- JWT token and Refresh Tokens are securely handled by the API client.
- The repository utilizes fully automated Spring Boot `ddl-auto: update` configuration to dynamically generate schemas on fresh deployments.
