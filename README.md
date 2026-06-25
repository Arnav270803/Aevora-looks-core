# Aevora Looks Core

Vite + React frontend for the Aevora landing page, login page, and ad creation workspace.

## Local Setup

Create `.env` from `.env.example`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
VITE_API_BASE_URL=http://localhost:4000/api
```

Run the frontend:

```bash
npm install
npm run dev
```

The login page is available at:

```text
http://localhost:5173/login
```

## Auth Flow

- `/login` renders Google Sign-In.
- Google returns an ID token credential to the frontend.
- The frontend sends that credential to `POST /api/auth/google`.
- The backend verifies Google, creates/updates the local user, and returns Aevora JWTs.
- The frontend stores the access and refresh tokens in local storage for MVP testing.
- `/app` is protected and redirects to `/login?next=/app` when there is no valid session.
