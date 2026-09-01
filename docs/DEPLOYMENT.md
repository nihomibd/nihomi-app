# NIHOMI.COM — DEPLOYMENT & HOSTING GUIDE

## 1. Hosting Architecture

Nihomi is optimized for dual deployment architectures:
1. **Google Cloud Run (Full-Stack Container Mode)**:
   - Primary production container hosting both the Vite static bundle and the compiled Express backend (`dist/server.cjs`).
   - Listens on `0.0.0.0:3000` behind Google Cloud Load Balancer / NGINX reverse proxy.
2. **Cloudflare Pages / Vercel (Edge Static Frontend Mode)**:
   - Static assets served via CDN.
   - API calls routed through Cloudflare Pages Functions (`/functions/api/[[catchall]].ts`) proxying to the Cloud Run backend.

## 2. Production Build Commands
```bash
# Build frontend assets and bundle Express backend to dist/server.cjs
npm run build

# Start production server
npm run start
```

## 3. Environment Variables Configuration

| Variable | Description | Required / Optional |
|---|---|---|
| `NODE_ENV` | Runtime environment (`production` or `development`) | Required |
| `PORT` | Server listening port (default `3000`) | Required |
| `GEMINI_API_KEY` | Google Gemini AI API key | Required |
| `DATABASE_URL` | PostgreSQL connection string for Prisma | Required for production |
| `SUPABASE_URL` | Supabase Cloud API URL | Required |
| `SUPABASE_ANON_KEY` | Supabase Public Anonymous Key | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Backend Service Role Key | Required for backend admin |
| `JWT_SECRET` | Secret key for signing stateless session tokens | Required |
| `BKASH_APP_KEY` | bKash Merchant API Key | Required for bKash payments |
| `BKASH_APP_SECRET` | bKash Merchant Secret Key | Required for bKash payments |
| `STRIPE_SECRET_KEY` | Stripe Production Secret Key | Required for card payments |
