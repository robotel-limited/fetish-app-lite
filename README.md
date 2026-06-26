# Fetish App Lite

A simple, self-contained habit tracker. No Docker, no cloud services, no external databases — just Node.js and SQLite.

## Quick Start

```bash
git clone <repo-url>
cd fetish-app-lite
npm install
npm start
```

Open **http://localhost:3001** — that's it.

> The first time the server starts, it automatically creates the SQLite database and runs migrations. Seeded habits are created when you register.

## Commands

| Command | Description |
|---|---|
| `npm install` | Install all dependencies (client + server) |
| `npm start` | Start the server on port 3001 |
| `npm run build` | Build the frontend for production |
| `npm run migrate` | Initialize/update the database manually |

## Tech Stack

- **Frontend:** Vite + React 18 + Tailwind CSS 3 + Framer Motion
- **Backend:** Node.js + Express (ES modules)
- **Database:** SQLite (via better-sqlite3)
- **Auth:** Email/password with bcrypt + JWT

## Project Structure

```
├── client/              # Vite + React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── hooks/       # React hooks
│       ├── context/     # React context providers
│       └── services/    # API client (Axios)
├── server/              # Express backend
│   └── src/
│       ├── config/      # Database, auth, env config
│       ├── models/      # SQLite models
│       ├── routes/      # API route handlers
│       ├── middleware/   # Auth, error handling
│       └── services/    # Business logic
├── scripts/             # Utility scripts
└── package.json         # Root scripts
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register with email + password
- `POST /api/auth/login` — Login with email + password
- `POST /api/auth/refresh` — Refresh access token
- `GET /api/auth/me` — Get current user

### Habits
- `GET /api/habits` — List habits (paginated)
- `POST /api/habits` — Create habit
- `GET /api/habits/:id` — Get habit
- `PUT /api/habits/:id` — Update habit
- `DELETE /api/habits/:id` — Soft-delete habit

### Progress
- `POST /api/progress` — Log progress
- `GET /api/progress/today` — Today's progress
- `GET /api/progress/streaks` — All streaks
- `GET /api/progress/dashboard` — Dashboard stats
- `GET /api/progress/:habitId` — Habit progress history

### User
- `GET /api/user/profile` — Get profile
- `PUT /api/user/profile` — Update profile

## Environment Variables

All variables are optional with sensible defaults. Create `server/.env` to override:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `JWT_SECRET` | (fallback) | JWT signing secret |
| `JWT_REFRESH_SECRET` | (fallback) | Refresh token secret |
| `JWT_EXPIRY` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token lifetime |
| `DB_PATH` | (auto) | Path to SQLite database file |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL (for CORS during dev) |
| `NODE_ENV` | `development` | Environment mode |

## Seeded Habits

New users automatically get these 5 habits:
1. ⏰ Wake up on time
2. 📖 Read every day
3. 💻 Code for at least 30 minutes
4. 🚶 Go for a walk
5. 🏆 Manage basic activities like a pro

## License

MIT
