# Frontend Deploy (Option 2: Frontend separate)

## Recommended
- Frontend: Vercel (React/Vite)
- Backend: separate server (Spring Boot)

## 1) Set API URL
Create `.env.production` (or set in Vercel env):

```bash
VITE_API_BASE_URL=https://YOUR_BACKEND_DOMAIN/api
```

## 2) Build check
```bash
npm install
npm run build
```

## 3) Vercel deploy
- Import `project/` repository to Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add env var: `VITE_API_BASE_URL`
- Deploy

## 4) Backend CORS check
Backend must allow frontend domain origin and credentials.

Example origin:
- `https://your-frontend.vercel.app`

## 5) Post-deploy smoke test
- `/` loads
- login works (cookie set)
- `/posts` list loads
- `/api/me` behavior works by auth state
