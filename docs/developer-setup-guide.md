# Developer Setup Guide

## Requirements
- Node.js 16+
- npm 8+
- MongoDB local instance or Atlas URI

## Setup
1. Install dependencies in root/server/client
2. Configure `.env` files from examples
3. Start MongoDB
4. Seed database
5. Run `npm run dev` from root

## Backend Scripts
- `npm run dev --prefix server`
- `npm run seed --prefix server`

## Frontend Scripts
- `npm start --prefix client`

## API Validation
Use `/api/health` to confirm backend is up.

## Next Enhancements
- Add Jest + supertest API tests
- Add React Testing Library tests
- Add Swagger/OpenAPI generator
