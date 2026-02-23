# Gym Management System

Full-stack gym operations app with:
- Spring Boot REST API (`gym-backend`)
- React + Vite frontend (`gym-frontend`)
- PostgreSQL database

It covers member management, trainer assignment, attendance, plans, payments, and a dashboard.

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Data JPA, Maven
- Frontend: React, React Router, Axios, Vite
- Database: PostgreSQL

## Project Structure

```text
Gym Mangement system/
├── gym-backend/
├── gym-frontend/
└── README.md
```

## Features

- Dashboard: total members, active members, trainers, attendance, revenue
- Member management: create/update/delete members and link plans
- Trainer assignment: manage trainers and assign/unassign to members
- Attendance tracking: check-in/check-out and date/member views
- Payment tracking: record payments and update status
- Basic auth module: login/signup for app access

## Prerequisites

- Java 17+
- Node.js 18+ and npm
- PostgreSQL 14+ (or compatible)

## Backend Setup (`gym-backend`)

1. Create a PostgreSQL database:
```sql
CREATE DATABASE testdb;
```
2. Update `gym-backend/src/main/resources/application.yaml` with your local DB credentials.
3. Start backend:
```bash
cd gym-backend
./mvnw spring-boot:run
```

Backend URL: `http://localhost:9999`

### Seeded Data

On startup, the app seeds:
- Admin user: `admin` / `admin123`
- Sample plans: Basic, Premium, Elite
- Sample trainers

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

The frontend calls backend at `http://localhost:9999/api` (configured in `gym-frontend/src/services/api.js`).

## Main API Groups

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `/api/home/dashboard`
- `/api/members`
- `/api/trainers`
- `/api/plans`
- `/api/attendance`
- `/api/payments`

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

## Notes

- CORS currently allows local frontend ports `5173` and `5174`.
- Current auth is basic (plain credential check). For production, use Spring Security + password hashing + JWT.
