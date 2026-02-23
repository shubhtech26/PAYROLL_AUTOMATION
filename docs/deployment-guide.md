# Deployment Guide

## Backend (Railway/Render/DO/Heroku-like)
1. Deploy `/server`
2. Configure env vars from `server/.env.example`
3. Set `MONGO_URI` to MongoDB Atlas
4. Set `CLIENT_URL` to frontend domain
5. Start command: `npm start`

## Frontend (Vercel/Netlify)
1. Deploy `/client`
2. Set `REACT_APP_API_URL` to backend `/api` URL
3. Build command: `npm run build`

## Production Checklist
- Enable HTTPS
- Use strong `JWT_SECRET`
- Restrict CORS
- Enable monitoring and logs
- Backup database regularly
