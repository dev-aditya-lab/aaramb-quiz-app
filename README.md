# Quiz Platform (Next.js + Express + MongoDB)

Scalable and modular quiz application implemented in JavaScript only.

## Stack

- Frontend: Next.js App Router + Tailwind CSS + `react-icons`
- Auth: NextAuth.js (Auth.js) + GitHub provider + MongoDB adapter
- Backend API: Native Next.js Route Handlers (service-controller-model logic reused)
- Database: MongoDB + Mongoose

## Run

1. Copy credentials in `.env.local`
2. Start app:

```bash
npm run dev
```

- Next.js: `http://localhost:3000`

## Environment

Required values in `.env.local`:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GOOGLE_ID`
- `GOOGLE_SECRET`
- `MONGODB_URI`

## Architecture

### Frontend (`src`)

- `app`: App Router pages and API proxy routes
- `components`: UI modules (`quiz`, `admin`, `layout`, `providers`)
- `hooks`: proctoring and quiz session logic
- `services`: API clients (`quizService`, `adminService`, `leaderboardService`)
- `lib`: auth and DB helpers
- `types`: shared constants

### Backend (`src/app/api` + `server` service logic)

- `models`: `User`, `Quiz`, `Question`, `Attempt`
- `services`: business logic and validations
- `controllers`: HTTP handlers
- `src/app/api`: endpoint declarations (Next Route Handlers)
- `server/services`: business logic reused by route handlers

## Core Features

- GitHub login with session-based route protection
- Admin control of quiz lifecycle (`draft`, `running`, `paused`)
- Timer modes: whole quiz, per-question, or mixed
- Per-question custom points and optional time override
- Random question pooling per user attempt
- Question-by-question fetching to protect answer payload exposure
- Server-side timing validation on answer submission
- Optimistic UI for answer progression
- Proctoring checks (tab switch, focus loss, context menu, copy/paste)
- Leaderboard accessible only to authenticated users who participated
- User moderation: ban/unban and quiz disqualification

## Indexing and Performance

Optimized indexes include:

- `Attempt.userId`, `Attempt.quizId`, and `{ quizId, totalScore, submittedAt }`
- `Question.quizId` and active/order compound index
- `Quiz.status` and created time
- `User.email`, `User.role`, `User.isBanned`

These improve high-volume reads for quiz listing, attempt lookup, leaderboard ranking, and admin analytics.

## Edge Cases Covered

- Quiz paused/stopped during active attempt -> attempt expires server-side
- Duplicate answer submission -> blocked
- Out-of-order question submissions -> blocked
- Client clock manipulation -> warning via timestamp skew check
- Question/quiz timer expiration -> attempt auto-expired
- Banned/disqualified users -> denied at auth/service layers
- Full payload inspection attempts -> mitigated by per-question API fetching
