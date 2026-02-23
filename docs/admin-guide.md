# Admin Guide

## Core Responsibilities
- Manage employee records
- Assign proper role (`admin`, `manager`, `employee`)
- Monitor attendance and leave dashboards
- Export data for HR and payroll

## Employee Creation Checklist
- Unique `employeeId`
- Correct department assignment
- Temporary password shared securely
- Verify active status

## Operational Tips
- Run daily attendance check before end of shift
- Resolve pending leave requests promptly
- Keep leave balances aligned with policy

## Security Best Practices
- Rotate `JWT_SECRET` in production
- Restrict CORS to production frontend URL
- Use HTTPS and secure MongoDB credentials
