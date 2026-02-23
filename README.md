# Water Lab Attendance Tracker (MERN)

Production-style Phase 1 implementation of an employee attendance + leave management system for a water testing laboratory.

## Stack
- **Frontend:** React 18, React Router, Axios, Tailwind CSS, React Hook Form, Recharts
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, express-validator
- **Security:** Helmet, CORS, rate limiting, input validation

## Project Structure
- `/server` - REST API, models, controllers, middleware, seed script
- `/client` - React application with role-ready routing and pages
- `/docs` - API/user/admin/developer/deployment guides

## Quick Start

### 1) Install dependencies
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 2) Configure environment variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3) Start MongoDB locally
```bash
mongod
```

### 4) Seed demo data
```bash
npm run seed --prefix server
```

### 5) Run frontend + backend
```bash
npm run dev
```

## Default Login
- Email: `admin@waterlab.com`
- Password: `Admin@123`

## Implemented Core Modules
- Auth: login/me/logout/change-password/register (admin-only)
- Employee management: CRUD, filters, pagination, stats
- Attendance: mark/update/history/today/export CSV
- Leave: request/pending/approve/reject/auto-attendance/delete/history
- Reports: dashboard stats, attendance report, leave report, CSV export

## Notes
- Phase 2 placeholders exist for calendar views and advanced features.
- JWT logout is token discard strategy (client-side invalidation).
- PDF export, Socket.io, uploads, and email flows are scaffold-ready but not fully implemented.
# PAYROLL_AUTOMATION
