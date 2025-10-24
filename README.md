# ShopSphere Commerce Platform

Full-stack e-commerce reference implementation featuring an Express + MongoDB backend API with email & SMS verification flows, and a Next.js (App Router) frontend optimised for Vercel deployments.

## Project layout

```
.
├── ecom-backend    # REST API (Node.js, Express, Mongoose)
├── ecom-frontend   # Customer/admin web experience (Next.js 16 + Tailwind)
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas cluster + credentials
- SMTP provider (Mailtrap, SendGrid, etc.)
- Twilio Verify service (or compatible SMS provider)

## Backend setup (`ecom-backend`)

```bash
cd ecom-backend
cp .env.example .env                  # fill in secrets
npm install
npm run dev                          # starts on http://localhost:4000
npm test                             # optional Jest smoke tests
```

Key environment variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `CLIENT_ORIGIN` | Comma-separated frontend origins for CORS |
| `SMTP_*` | SMTP host credentials for Nodemailer |
| `TWILIO_*` | Twilio Verify credentials for SMS OTP |

Core endpoints (all prefixed with `/api`):

- `POST /auth/register` – create account, send email + optional SMS verification
- `POST /auth/login` – issue JWT
- `GET /auth/verify-email?token=...` – confirm email
- `POST /auth/email/resend` – resend verification (auth required)
- `POST /auth/phone/request` + `POST /auth/phone/verify` – SMS OTP flow
- `GET /products`, `POST /products` (admin), `PUT /products/:id`, `DELETE /products/:id`
- `POST /orders`, `GET /orders`, `GET /orders/:id`
- `GET /users/me`, `PUT /users/me`

## Frontend setup (`ecom-frontend`)

```bash
cd ecom-frontend
cp .env.example .env.local            # configure NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev                          # http://localhost:3000
npm run build                        # production build verification
```

Features:

- Responsive product catalogue, detail pages, cart & checkout
- Auth flows (login/register) with persisted tokens via Zustand
- Email verification acknowledgement + SMS OTP triggers
- Order history dashboard (customer) and product publisher (admin)
- Tailwind-powered UI ready for Vercel deployment (`npm run build`)

## Deployment notes

1. Backend: deploy to your preferred Node host (Render, Railway, Fly.io, etc.) with environment variables from `.env`.
2. Frontend: deploy to Vercel using `NEXT_PUBLIC_API_BASE_URL` pointing to the backend URL.
3. Ensure MongoDB Atlas IP allowlist includes hosting providers.
4. Configure SMTP + Twilio credentials per environment.

## Scripts quick reference

| Location | Command | Purpose |
|----------|---------|---------|
| Backend | `npm run dev` | Start Express server with nodemon |
| Backend | `npm test` | Execute Jest API smoke tests |
| Frontend | `npm run dev` | Start Next.js dev server |
| Frontend | `npm run build` | Create optimized production build |

---

For production hardening consider adding: Stripe integration for payments, rate limiting, request validation guards, RLS policies, and comprehensive testing.
