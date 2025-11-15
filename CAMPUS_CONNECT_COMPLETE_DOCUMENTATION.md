# Campus Connect — System Design and Architecture (Comprehensive Guide)

This document expands on the README to provide an in-depth technical walkthrough of Campus Connect’s system design and architecture. It explains component interactions, technologies used, feature dependencies, and includes clear ASCII diagrams and flowcharts for critical flows.

---

## Table of Contents
- Overview and Goals
- High-Level Architecture
- Technology Stack by Layer
- Component Interaction Map
- Feature Relationships and Dependencies
- Detailed Flowcharts (OTP, Issue Lifecycle, Authority Management)
- Client Application Design
- Server Application Design
- Data Models and Contracts
- Error Handling and Security
- Operations, Configuration, and Deployment
- Interview Prep: Key Talking Points

---

## Overview and Goals
Campus Connect is a full-stack platform for reporting, tracking, and resolving campus issues. It supports two roles:
- Users: report issues with optional images, track status, comment.
- Authorities: view relevant issues (category-scoped), update status, comment, analyze trends.

Design priorities:
- Role-based access control with secure onboarding via OTP.
- Clear UX with validation, empty states, and responsive design.
- Maintainable architecture with typed contracts and normalized state.

---

## High-Level Architecture

Client (React/TypeScript) ↔ REST API (Axios) ↔ Server (Express/Node) ↔ Database (MongoDB/Mongoose)
↕ Email (Nodemailer for OTP) ↔ File Storage (Multer disk uploads)

```
┌───────────────────────────────┐        HTTP/JSON        ┌───────────────────────────────┐
│          Web Client          │<────────────────────────>│       Express REST API        │
│  React + TS + Router + UI    │                          │  Auth, Issues, Comments, Admin│
└───────────────────────────────┘                          └───────────────────────────────┘
              ▲                                                         │
              │ Axios                                                   │ Mongoose
              │                                                         ▼
        LocalStorage                                            ┌───────────────────┐
        (JWT, user session)                                     │     MongoDB      │
              │                                                 │ Users, Issues    │
              │                                                 │ Comments, OTPs   │
              ▼                                                 └───────────────────┘
    Protected Routes +                                           ▲           ▲
    Context State                                                │           │
                                                                  │           │
                   ┌───────────────┐                Multer        │           │ Nodemailer
                   │ Uploads Dir   │<────────────── Disk Store ───┘           │ (Email OTP)
                   │ /uploads/...  │                                         └────────────┘
                   └───────────────┘
```

---

## Technology Stack by Layer

Frontend (Client):
- React 18 with TypeScript: component-driven UI and strong typing.
- Vite: fast dev server and optimized builds.
- Tailwind CSS: utility-first responsive styling.
- React Router v6: client-side routing and protected routes.
- Axios: HTTP client with interceptors for JWT handling.
- Context API: global state (AuthContext, IssueContext).
- date-fns: date utilities for UI formatting and analytics.

Backend (Server):
- Node.js + Express: REST API routing and middleware.
- MongoDB + Mongoose: document storage and schema models.
- JWT (jsonwebtoken): stateless authentication tokens.
- bcryptjs: secure password hashing.
- Multer: image uploads and validation.
- Nodemailer: email delivery for OTP verification.
- express-validator: request validation.
- cors: cross-origin resource sharing.
- dotenv: environment configuration.

---

## Component Interaction Map

Key interaction flows across layers:

- Authentication:
  - Login/Register (OTP): Client collects credentials → sends to Auth API → server validates, issues JWT → client stores JWT → protected routes unlocked.
  - Axios interceptors attach `Authorization: Bearer <token>`; server `protect` middleware validates and attaches `req.user`.

- Issue Reporting:
  - Client validates inputs and image → posts multipart form to `/api/issues` → server stores file (Multer), persists issue → client updates context and redirects to My Issues.

- Issue Management (Authority):
  - Client loads `/api/issues` (scoped by categories) → filters on client → updates status via `/api/issues/:id/status` → context updates state; comments via `/api/issues/:id/comments`.

- Analytics:
  - Client derives metrics from loaded issues: counts by status, category, department; time range filters; no heavy server aggregation (current scope).

Sequence (OTP Registration):
```
User    Browser (React)           API (Express)            DB (Mongo)         Email (Nodemailer)
 ─┬─────────┬─────────────────────┬───────────────────────┬───────────────────┬────────────────
  │ Fill form│                    │                       │                   │
  │         ├─ POST /auth/send-otp ─────────────────────→ │ Create OTP doc    │ Send email
  │         │                         ◄────────────────────┤ (TTL 10 mins)     │ (dev: log to console)
  │         │                                             │                   │
  │ Enter OTP ├─ POST /auth/verify-otp ─────────────────→ │ Validate OTP,     │
  │         │                         │                   │ create User, del OTP
  │         │                         ◄───────────────────┤ Return user + JWT │
  │ Save JWT │                                               
  │ Navigate to dashboard                                  
```

Sequence (Issue Reporting):
```
User    Browser (React)           API (Express)            Uploads            DB (Mongo)
 ─┬─────────┬─────────────────────┬───────────────────────┬───────────────────┬──────────────
  │ Fill form│                    │                       │                   │
  │ Validate ├─ POST /issues (multipart) ───────────────→ │ Store image (disk)│ Create Issue
  │         │                         ◄───────────────────┤ return imageUrl   │ return issue
  │ Update context, show success, redirect to /my-issues
```

---

## Feature Relationships and Dependencies

- OTP Registration depends on:
  - Email service functioning (Nodemailer); in dev, console logging is acceptable.
  - OTP TTL persistence and cleanup to avoid reuse (Mongo TTL index).
  - User creation pipeline (password hashing via bcrypt pre-save hook).

- Role-Based Access Control (RBAC) relies on:
  - JWT verification (server `protect` middleware).
  - Role checks (server `authorize('authority')`, client `ProtectedRoute`).
  - Authority category scoping (server filters issues by `req.user.categories`).

- Issue Listing and Filtering depend on:
  - Consistent Issue schema and normalized client transformation.
  - Axios interceptors for authenticated requests.
  - Local filtering for search/category/status/department.

- Analytics depend on:
  - Loaded issue dataset in context.
  - Deterministic client-side aggregations; time-window filters use `date-fns`.

- Comments depend on:
  - Issue existence and correct user authorization.
  - Server-side persistence (embedded comments or standalone collection as needed).

---

## Detailed Flowcharts

OTP Registration Flow:
```
+----------------+
| Start Register |
+--------+-------+
         |
         v
+-----------------------+
| Fill form (name,      |
| email, password, role |
| dept/categories)      |
+-----------+-----------+
            |
            v
+-----------------------+
| Send OTP request      |
| POST /auth/send-otp   |
+-----------+-----------+
            |
            v
+-----------------------+
| OTP stored (TTL 10m)  |
| Email/SMS dispatched  |
+-----------+-----------+
            |
            v
+-----------------------+
| Enter & submit OTP    |
| POST /auth/verify-otp |
+-----------+-----------+
            |
    +-------+-------+
    |               |
    v               v
+--------+     +------------+
| OTP OK |     | OTP FAIL   |
+--------+     +------------+
    |               |
    v               v
+-----------------------+    +---------------------------+
| Create user, return   |    | Show error, allow retry  |
| JWT + user profile    |    +---------------------------+
+-----------+-----------+
            |
            v
+-----------------------+
| Save session, redirect|
| to dashboard          |
+-----------------------+
```

Issue Lifecycle (User → Authority → Resolution):
```
User reports → status: Pending
        │
        ▼
Authority triages → may add comment
        │
        ▼
Status update: In Progress
        │
        ▼
Work completed → Status: Resolved
        │
        ▼
Analytics updated on next fetch
```

Authority Management Flow:
```
+--------------------+
| Authority Logs In  |
+---------+----------+
          |
          v
+--------------------+
| Fetch All Issues   |
| GET /issues        |
| (category-scoped)  |
+---------+----------+
          |
          v
+--------------------+
| Filter & Sort      |
| (status, dept,     |
| search, category)  |
+---------+----------+
          |
          v
+--------------------+
| Update Status      |
| PUT /issues/:id/   |
| status             |
+---------+----------+
          |
          v
+--------------------+
| Add Comments       |
| POST /issues/:id/  |
| comments           |
+--------------------+
```

---

## Client Application Design

- Routing: `App.tsx` with public (`/`, `/login`, `/register`) and protected routes (`/dashboard`, `/report-issue`, `/my-issues`, `/all-issues`, `/analytics`, `/profile`). `ProtectedRoute` enforces auth and role checks.

- State: Contexts manage global state:
  - `AuthContext`: holds `user`, `token`, `isAuthenticated`, loading/error; integrates with localStorage.
  - `IssueContext`: holds `issues`, `myIssues`, loading/error; exposes actions to fetch/create/update/comment.

- API Integration:
  - `services/api.ts`: Axios instance with request/response interceptors; attaches JWT, handles 401.
  - `services/authService.ts`: `sendOTP`, `verifyOTP`, `login`, `getMe`, `updateProfile`.
  - `services/issueService.ts`: `getIssues`, `getMyIssues`, `createIssue` (multipart), `updateIssueStatus`, `addComment`.

- Pages and UI:
  - `LandingPage`: overview and CTAs.
  - `RegisterPage`: role tabs, dept/category inputs, OTP modal, success modal.
  - `LoginPage`: credentials, validation, role-based redirect.
  - `ReportIssue`: form validation, image handling, success feedback and redirect.
  - `MyIssues`: personal issues list, filtering, stats, comments.
  - `AllIssues`: authority issues list with cards/table, filters, inline status update, comments.
  - `Analytics`: category/status/department metrics with time ranges.
  - `DashboardUser`/`DashboardAuthority`: quick actions and summaries.

- UI/UX Patterns:
  - Tailwind CSS components; consistent badges, chips, skeletons.
  - Error and success states clearly surfaced.

---

## Server Application Design

- Bootstrapping: `server.js` configures CORS, JSON parsers, static `/uploads`, routes, and error handlers.

- Middlewares:
  - `authMiddleware.protect`: verifies JWT and populates `req.user`.
  - `authMiddleware.authorize(role)`: guards role-specific endpoints.
  - `errorHandler`: centralized error formatting.

- Routes:
  - Auth: `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/login`, `/api/auth/me`, `/api/auth/profile`.
  - Issues: `/api/issues` (list/create), `/api/issues/my-issues`, `/api/issues/:id`, `/api/issues/:id/status`, `/api/issues/:id/comments`.
  - Admin: `/api/admin/...` for authority-only analytics or management.

- Controllers:
  - `authController`: OTP generation/verification, login, me, profile update.
  - `issueController`: CRUD operations, status update, comments.
  - `adminController`: analytics and user management (as applicable).

- Uploads:
  - `utils/uploadConfig.js`: Multer disk configuration with MIME/type checks and 5MB limit.
  - Files served from `/uploads/issue-images/...` and referenced via `imageUrl`.

---

## Data Models and Contracts

- User:
  - Fields: `name`, `email`, `password (hashed)`, `role ('user'|'authority')`, `department?`, `categories?`, timestamps.
  - Methods/Hooks: bcrypt hashing on save; password comparison.

- Issue:
  - Fields: `title`, `description`, `category`, `status ('pending'|'in-progress'|'resolved')`, `reporter (User ref)`, `imageUrl?`, `department?`, `comments[]`, timestamps.
  - Comments: embedded subdocuments with `user`, `text`, `createdAt`.

- OTP:
  - Fields: `email`, `otp`, `userData` (name/email/password/role/department/categories), `createdAt` with TTL index (10 minutes).

Client Transformations (IssueContext):
- Normalize `_id` to `id`.
- Flatten reporter details (`reporterName`, `reporterDepartment`).
- Map comment `user` to displayable author attributes.

---

## Error Handling and Security

- Errors:
  - Client: form-level errors; global API errors via contexts; 401 clears session.
  - Server: standardized JSON `{ status, message }` with stack in dev; 404 via notFound handler.

- Security:
  - Auth: JWT with expiration; verify on each protected request.
  - RBAC: client guards + server authorization middleware.
  - Passwords: bcrypt hashing; never exposed.
  - Uploads: type/size validation; stored outside code; served statically.
  - OTP: TTL ensures short-lived verification windows; single-use cleanup.
  - CORS: limited to client origin.

---

## Operations, Configuration, and Deployment

- Environments:
  - Client `.env`: `VITE_API_URL`, branding.
  - Server `.env`: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `EMAIL_*`.

- Running:
  - Client: `npm run dev` (Vite dev server).
  - Server: `npm run dev` (nodemon or node).

- Health & Monitoring:
  - Optional `GET /api/health` for health checks.
  - Logs in controllers for key actions.

- Storage:
  - MongoDB for persistent data.
  - `/uploads` for images; ensure backup and access controls in production.

---

## Interview Prep: Key Talking Points

- Why OTP? Ensures verified onboarding; decouples registration from immediate account creation; resilient via TTL and cleanup.
- How RBAC is enforced? Double layer: client route guards + server-side `authorize()`; categories further scope authority visibility.
- How uploads are handled? Client validates image; server persists via Multer, returns `imageUrl`; links stored in Issue, served statically.
- How analytics work? Client-side aggregations on `issues` state; time range filters drive derived metrics.
- How state is kept consistent? Centralized contexts; Axios interceptors; normalized transformations; optimistic UI where safe.
- What are production considerations? Rate limiting for OTP/login, pagination, server-side filtering, audit logging, notification systems.

---

This document aligns with the README’s feature and stack descriptions while providing deeper technical detail, interaction sequences, and diagrams for core flows. For further expansion, we can add endpoint-by-endpoint schemas and sequence diagrams for error cases (e.g., token expiry, upload failures).