# Gym Management System - Project Report

## 1. Project Overview
The Gym Management System is a full-stack web application to digitize gym operations including member lifecycle management, subscription plans, trainer assignment, attendance logging, payment tracking, and operational dashboard analytics.

The solution is composed of:
- Backend REST API (`gym-backend`) built with Spring Boot + PostgreSQL
- Frontend SPA (`gym-frontend`) built with React + Vite + Axios

## 2. Problem Statement
Many gyms rely on manual registers and disconnected tools, creating data inconsistency and operational delays. This project centralizes core workflows into one platform for:
- User access control and onboarding
- Member and trainer administration
- Plan mapping and fee management
- Attendance and payment visibility
- Admin monitoring through dashboard KPIs

## 3. Objectives
- Deliver secure API-first gym operations with modular frontend screens.
- Enforce authenticated access across all business modules.
- Provide role-based control for admin-only user verification workflows.
- Maintain clean relationships between members, plans, trainers, attendance, and payments.
- Offer fast operational insight with real-time dashboard summaries.

## 4. Scope of the Project
### In Scope
- JWT-based login/signup flow
- Role-aware route and API protection
- Admin user management (verify/unverify/delete non-admin users)
- Plan, member, and trainer CRUD workflows
- Trainer-to-member assignment management
- Attendance check-in/check-out workflows
- Payment create/filter/status-update workflows
- Dashboard KPIs: members, trainers, attendance, paid revenue

### Out of Scope (Current Version)
- Refresh tokens and token revocation strategy
- Granular RBAC beyond current ADMIN/USER pattern
- Reporting exports (PDF/Excel)
- Notification/reminder engine
- Full automated test suite and CI/CD automation

## 5. Technology Stack
### Backend
- Java 17
- Spring Boot 3.5.10
- Spring Data JPA
- Spring Validation
- Spring Security
- JWT (`io.jsonwebtoken:jjwt`)
- Maven
- PostgreSQL JDBC driver
- Lombok

> Note: Thymeleaf is not used — the backend is a pure REST API.

### Frontend
- React 19
- React Router DOM
- Axios
- Vite
- Bootstrap 5 (CDN)

### Database
- PostgreSQL (`testdb` in local setup)

## 6. System Architecture
The application follows a layered architecture:
- Controller Layer: request handling and endpoint exposure
- Service Layer: business logic and orchestration
- Repository Layer: persistence via Spring Data JPA
- DTO/Entity Layer: API contracts and relational modeling
- Frontend Layer: page modules + service clients

Request flow:
1. User action in React UI.
2. Axios sends request to backend.
3. JWT is attached via Axios interceptor.
4. Spring Security validates token and role.
5. Controller delegates to service + repository.
6. DTO response is returned and rendered.

## 7. Module-wise Implementation
### 7.1 Authentication & Security Module
- Public endpoints: `POST /api/auth/login`, `POST /api/auth/signup`
- Signup validation rules include:
  - Username length and allowed characters
  - Password length
  - Password complexity (upper/lower/number/special char)
  - No whitespace in password
- Password storage with BCrypt hashing
- JWT token generation includes username and role claims
- Stateless security (`SessionCreationPolicy.STATELESS`)
- Legacy plain-text passwords are migrated to BCrypt on successful login

### 7.2 Admin User Management Module
- Protected endpoints under `/api/admin/users`
- Access restricted to `ROLE_ADMIN`
- Features:
  - List all users
  - Verify/unverify non-admin users
  - Delete non-admin users
- New users are created with `verified=false`; verification is required before login

### 7.3 Dashboard Module
- Endpoint: `GET /api/home/dashboard`
- Displays:
  - Total members
  - Active members
  - Total trainers
  - Attendance count
  - Total paid revenue (`PAID` payments)

### 7.4 Member & Plan Module
- Plan CRUD: `/api/plans`
- Member CRUD: `/api/members`
- Member-plan mapping support
- Member active/inactive tracking

### 7.5 Trainer Assignment Module
- Trainer CRUD: `/api/trainers`
- Assign trainer: `POST /api/members/{memberId}/trainers/{trainerId}`
- Remove trainer: `DELETE /api/members/{memberId}/trainers/{trainerId}`

### 7.6 Attendance Module
- Endpoints under `/api/attendance`
- Features:
  - Mark attendance (check-in)
  - Update checkout
  - Filter by member/date
- Backend auto-fills current date/time when missing

### 7.7 Payment Tracking Module
- Endpoints under `/api/payments`
- Features:
  - Create payment entries
  - Filter by member and status
  - Update payment status
- Revenue KPI counts only entries with `PAID` status

## 8. Data Model Summary
Core entities:
- `User`: id, username, password, role, verified
- `Plan`: name, description, durationMonths, price, active
- `Member`: profile info, active, linked plan
- `Trainer`: profile info, specialization
- `Attendance`: member, date, checkIn, checkOut
- `Payment`: member, plan, amount, status, paymentDate, paymentMethod, dueDate

Relationships:
- Member -> Plan: Many-to-One
- Member <-> Trainer: Many-to-Many
- Member -> Attendance: One-to-Many
- Member -> Payment: One-to-Many
- Payment -> Plan: Many-to-One

## 9. API Endpoint Summary
- Auth: `/api/auth/*`
- Admin Users: `/api/admin/users/*`
- Dashboard: `/api/home/dashboard`
- Members: `/api/members/*`
- Trainers: `/api/trainers/*`
- Plans: `/api/plans/*`
- Attendance: `/api/attendance/*`
- Payments: `/api/payments/*`

## 10. Frontend Features and UX
- Protected route handling with optional admin gating
- Auth state synchronized via browser events
- Token-aware Axios client with auto-logout on `401`
- Unified module screens:
  - Dashboard
  - Member Plans
  - Trainer Assignment
  - Attendance
  - Payment Tracking
  - Admin Users (admin-only)
  - Login/Signup
- Validation and API feedback shown through alert messaging

## 11. Seed Data and Initialization
At startup, `DataInitializer` seeds:
- Admin user: `admin` / `admin123` (role `ADMIN`, verified)
- Default plans: Basic, Premium, Elite
- Default trainers: John Smith, Sarah Johnson

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
- Create PostgreSQL database: `testdb`
- Configure datasource in `gym-backend/src/main/resources/application.yaml`

## 13. Testing Status
- Backend has only base scaffold test class (`GymManagementSystemApplicationTests`).
- Major business modules currently rely on manual functional validation.
- Automated unit and integration coverage is still pending.

## 14. Current Limitations / Risks
- No refresh token implementation.
- No pagination on list-heavy endpoints.
- No audit trail for sensitive admin operations.
- DB credentials and JWT secret have local defaults in `application.yaml`; for production, override via environment variables (`DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).

## 15. Future Enhancements
- Add refresh-token flow and secure token rotation.
- Introduce fine-grained role/permission model.
- Add pagination, sorting, and richer filters.
- Add exportable reports and trend analytics.
- Add reminders for expiring plans and overdue dues.
- Add unit/integration tests with CI pipeline.
- Introduce Docker-based deployment with env-based secrets.

## 16. Conclusion
The current version delivers a robust gym operations platform with secured API access, admin-controlled user activation, and complete foundational business modules. It is well-positioned for production hardening through enhanced token strategy, testing automation, and deployment standardization.
