# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
- `POST /auth/register` (admin only)
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `PUT /auth/change-password`

## Employees
- `GET /employees` (pagination, filters: `search`, `department`, `status`, `role`)
- `GET /employees/:id`
- `POST /employees` (admin)
- `PUT /employees/:id` (admin/manager)
- `DELETE /employees/:id` (admin)
- `GET /employees/:id/stats`

## Attendance
- `GET /attendance`
- `GET /attendance/today`
- `GET /attendance/:id`
- `POST /attendance` (admin/manager)
- `PUT /attendance/:id` (admin/manager)
- `DELETE /attendance/:id` (admin)
- `GET /attendance/export` (admin/manager)

## Leaves
- `GET /leaves`
- `GET /leaves/pending` (admin/manager)
- `GET /leaves/:id`
- `POST /leaves`
- `PUT /leaves/:id/approve` (admin/manager)
- `PUT /leaves/:id/reject` (admin/manager)
- `DELETE /leaves/:id`
- `GET /leaves/employee/:id`

## Reports
- `GET /reports/attendance`
- `GET /reports/leave`
- `GET /reports/dashboard`
- `POST /reports/export`

## Auth Header
Set `Authorization: Bearer <JWT_TOKEN>` for protected routes.
