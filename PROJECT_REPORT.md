# Gym Management System - Project Report

## 1. Project Overview
The Gym Management System is a full-stack web application built to digitize daily gym operations such as member management, plan management, trainer assignment, attendance tracking, payment tracking, and dashboard reporting.

The solution consists of:
- Backend REST API (`gym-backend`) using Spring Boot and PostgreSQL
- Frontend client (`gym-frontend`) using React + Vite + Axios

## 2. Problem Statement
Traditional gym workflows are often handled through registers, spreadsheets, and disconnected tools. This project addresses those issues by providing a centralized system for:
- Maintaining member and trainer records
- Managing subscription plans
- Recording daily attendance
- Tracking payment status and revenue
- Monitoring key gym metrics from a dashboard

## 3. Objectives
- Provide a clean CRUD interface for core gym entities.
- Maintain relationships between members, trainers, plans, attendance, and payments.
- Offer quick operational visibility through a dashboard.
- Include basic authentication for protected access.

## 4. Scope of the Project
### In Scope
- User login/signup (basic authentication)
- Plan and member management
- Trainer management and assignment to members
- Attendance check-in and check-out flow
- Payment creation, filtering, and status updates
- Dashboard KPIs (members, trainers, attendance, paid revenue)

### Out of Scope (Current Version)
- JWT/session-based secure authentication
- Role-based authorization enforcement
- Advanced reporting exports (PDF/Excel)
- Notification/reminder workflows
- Audit logs and full test automation coverage

## 5. Technology Stack
### Backend
- Java 17
- Spring Boot 3.5.x
- Spring Data JPA
- Spring Validation
- Maven
- PostgreSQL JDBC Driver
- Lombok

### Frontend
- React 19
- React Router DOM
- Axios
- Vite
- Bootstrap 5 (via CDN)

### Database
- PostgreSQL (`testdb` in current local setup)

## 6. System Architecture
The project follows a layered architecture:
- Controller Layer: Exposes REST endpoints and request handling.
- Service Layer: Contains business logic.
- Repository Layer: Handles persistence with Spring Data JPA.
- Entity/DTO Layer: Entity mapping and API payload shaping.
- Frontend UI Layer: React pages + services to consume backend APIs.

High-level flow:
1. User action in React UI.
2. Axios service calls backend endpoint.
3. Controller delegates to service.
4. Service performs business logic and repository operations.
5. Response DTOs are returned to frontend and rendered.

## 7. Module-wise Implementation
### 7.1 Authentication Module
- Endpoints: `POST /api/auth/login`, `POST /api/auth/signup`
- Implements username/password validation on signup.
- Stores authenticated user info in browser `localStorage`.
- Uses route guards (`ProtectedRoute`) on frontend.

### 7.2 Dashboard Module
- Endpoint: `GET /api/home/dashboard`
- Displays:
  - Total members
  - Active members
  - Total trainers
  - Today attendance count
  - Total paid revenue (sum of payments with status `PAID`)

### 7.3 Member & Plan Module
- Plan CRUD: `/api/plans`
- Member CRUD: `/api/members`
- Members can be linked/unlinked with plans.
- Member status tracking (`active` flag).

### 7.4 Trainer Assignment Module
- Trainer CRUD: `/api/trainers`
- Member-trainer mapping:
  - Assign: `POST /api/members/{memberId}/trainers/{trainerId}`
  - Remove: `DELETE /api/members/{memberId}/trainers/{trainerId}`

### 7.5 Attendance Module
- Endpoints under `/api/attendance`
- Features:
  - Mark attendance (check-in)
  - Update check-out time
  - Filter attendance by member or date
- Default behavior:
  - If date/check-in is not provided, backend uses current date/time

### 7.6 Payment Tracking Module
- Endpoints under `/api/payments`
- Features:
  - Create payment records
  - Filter by member and status
  - Update payment status
- Revenue in dashboard is calculated only from `PAID` payments.

## 8. Data Model Summary
Core entities in backend:
- `User`: username, password, role
- `Plan`: name, description, durationMonths, price, active
- `Member`: name, contact info, active, linked plan
- `Trainer`: name, specialization, contact info
- `Attendance`: member, date, checkIn, checkOut
- `Payment`: member, plan, amount, paymentDate, status, paymentMethod, dueDate

Relationships:
- Member -> Plan: Many-to-One
- Member <-> Trainer: Many-to-Many
- Member -> Attendance: One-to-Many
- Member -> Payment: One-to-Many
- Payment -> Plan: Many-to-One

## 9. API Endpoint Summary
- Auth: `/api/auth/*`
- Dashboard: `/api/home/dashboard`
- Members: `/api/members/*`
- Trainers: `/api/trainers/*`
- Plans: `/api/plans/*`
- Attendance: `/api/attendance/*`
- Payments: `/api/payments/*`

## 10. Frontend Features and UX
- Route-based navigation with protected routes.
- Unified module pages:
  - Dashboard
  - Member Plans
  - Trainer Assignment
  - Attendance
  - Payment Tracking
  - Login/Signup
- Form validation and API error messages shown in alert cards.
- Loading states and success/error feedback included in module pages.

## 11. Seed Data and Initialization
At backend startup, `DataInitializer` seeds:
- Admin user: `admin` / `admin123`
- Default plans: Basic, Premium, Elite
- Default trainers: two sample trainers

## 12. Build and Run Instructions
### Backend
```bash
cd gym-backend
./mvnw spring-boot:run
```
Runs on: `http://localhost:9999`

### Frontend
```bash
cd gym-frontend
npm install
npm run dev
```
Runs on: `http://localhost:5173`

### Database
- Create PostgreSQL database (example): `testdb`
- Configure datasource in `gym-backend/src/main/resources/application.yaml`

## 13. Testing Status
- Backend includes minimal test scaffold (`GymManagementSystemApplicationTests`).
- No substantial automated unit/integration test suite is currently implemented.
- Current validation is primarily through runtime behavior and frontend form checks.

## 14. Current Limitations / Risks
- Authentication uses plain password comparison and no token mechanism.
- Passwords are stored in plain text (not hashed).
- No backend role-based authorization despite role field presence.
- Limited centralized exception handling (runtime exceptions may surface directly).
- No pagination for list endpoints (can impact performance with large datasets).
- Local environment-specific configuration is directly present in application config.

## 15. Future Enhancements
- Implement Spring Security with BCrypt + JWT authentication.
- Add role-based access control (ADMIN/STAFF policies).
- Add global exception handling and standardized API error responses.
- Introduce pagination, sorting, and advanced filtering.
- Add reporting exports (PDF/Excel) and analytics trends.
- Add reminders for expiring plans and overdue payments.
- Add comprehensive unit/integration tests and CI pipeline.
- Containerize deployment using Docker and environment-based configs.

## 16. Conclusion
This project successfully delivers a practical gym operations platform with all key foundational modules integrated in a single full-stack system. It is suitable for small-to-medium gym workflows in its current form and provides a strong base for production-grade enhancements in security, scalability, and automated testing.
