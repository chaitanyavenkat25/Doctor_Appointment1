# DocBook — Deployment Guide

## Local Development Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # Fill in your values
node config/seedAdmin.js  # Create admin account

# Frontend
cd ../frontend
npm install
cp .env.example .env   # Set VITE_API_URL
```

### 2. Run Locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev   # http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev  # http://localhost:3000
```

---

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com → Create free cluster
2. Create Database User (username + strong password)
3. Add IP `0.0.0.0/0` to Network Access (or your server IP)
4. Get connection string → paste in `MONGO_URI` in `.env`

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/doctor_appointment?retryWrites=true&w=majority
```

---

## Backend Deployment — Render

1. Push `backend/` to a GitHub repository
2. Go to https://render.com → New → Web Service
3. Connect your repo
4. Set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add all environment variables from `.env` in the Render dashboard
6. Deploy → Copy your backend URL (e.g., `https://docbook-api.onrender.com`)

---

## Frontend Deployment — Vercel

1. Push `frontend/` to a GitHub repository
2. Go to https://vercel.com → New Project → Import repo
3. Add environment variable:
   - `VITE_API_URL` = `https://docbook-api.onrender.com/api`
4. Deploy → Your app is live!

---

## Environment Variables Reference

### Backend (.env)
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret key |
| `JWT_EXPIRE` | Token expiry (e.g., `30d`) |
| `CLIENT_URL` | Frontend URL for CORS |
| `EMAIL_HOST` | SMTP host (e.g., smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (587) |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASS` | Gmail App Password |

### Frontend (.env)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Gmail App Password Setup (for Nodemailer)

1. Go to Google Account → Security → 2-Step Verification (enable it)
2. Search "App passwords" → Create one for "Mail"
3. Use that 16-char password as `EMAIL_PASS`

---

## Admin Account

After running `node config/seedAdmin.js`:
- Email: `admin@docbook.com`
- Password: `Admin@123`

> Change these credentials immediately in production!

---

## Production Checklist

- [ ] Strong `JWT_SECRET` (use `openssl rand -base64 64`)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS `CLIENT_URL` set to your Vercel domain
- [ ] Admin password changed after first login
- [ ] Email credentials verified
- [ ] HTTPS enabled (automatic on Vercel/Render)
