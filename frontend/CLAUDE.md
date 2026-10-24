# Thryve AI Frontend
React 19 + TypeScript SPA with separate client and admin areas, talking to the Spring Boot backend in `../backend`.

## Stack
- **Build:** Vite (dev server on port 5173 — the backend's OAuth redirect URI and CORS default assume this port). Package manager: npm.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`; theme tokens in CSS).
- **Routing:** React Router.
- **Data:** Axios as the HTTP layer, TanStack Query for caching, loading/error state and invalidation after mutations.
- **Forms:** react-hook-form + zod. Zod schemas mirror backend validation and are the source of request types.
- **Charts:** Recharts.
- **Tests:** Vitest + React Testing Library + MSW. Priority coverage: auth callback, 401 interceptor, workout CRUD flows. Sonar for the frontend is deferred.

## API & auth
- No dev proxy. Call the backend directly at `VITE_API_BASE_URL` (dev: `http://localhost:8080`) and rely on the backend's `CorsConfig` (`APP_CORS_ALLOWED_ORIGINS`). Never hardcode hosts.
- Login is a full-page navigation to `${VITE_API_BASE_URL}/oauth2/authorization/google`. The backend's `OAuth2SuccessHandler` redirects to `/auth/callback?token=<Google ID token>`.
- `/auth/callback`: store the token in `sessionStorage`, strip it from the URL with `history.replaceState`, navigate to `/client/dashboard`.
- Axios interceptor attaches `Authorization: Bearer <token>`. On 401: clear the token and redirect to `/client/login?expired=1`, which shows a "session expired" banner. The token is Google-issued (~1h) and there is no refresh token.
- Logout: clear `sessionStorage` and the TanStack Query cache, navigate to `/`. No backend call, no Google sign-out.
- Every response is wrapped in `ApiResponse { success, statusCode, message, data, timestamp }`; unwrap `data` in the API layer. List endpoints return a Spring `Page`.
- TypeScript types mirror backend DTOs and enums (`WorkoutType`, `WorkoutStatus`, `ExerciseType`, `MetricType`, etc.).

## Project structure
Feature-based:
```
src/
  features/
    auth/        # callback, token storage, useCurrentUser (/api/v1/auth/me), guards
    workouts/    # api, hooks, components, schemas, types
    progress/
    admin/
  components/ui/ # shared presentational components (buttons, dialogs, inputs)
  lib/axios.ts   # axios instance + interceptors
  routes/        # route definitions and guards
  pages/         # route-level pages composing features
  assets/        # locally stored stock images
```

## Routes
| Path | Access | Notes |
|---|---|---|
| `/` | public | Home page |
| `/client/login` | public | Google sign-in button; `?expired=1` shows banner |
| `/auth/callback` | public | Token handoff from backend |
| `/client/dashboard` | authenticated | Overview |
| `/client/dashboard/workouts` | authenticated | |
| `/client/dashboard/progress` | authenticated | |
| `/client/dashboard/goals` | authenticated | "Coming soon" placeholder |
| `/admin` | `role === 'ADMIN'` | Empty placeholder; non-admins get a **404** |

The dashboard uses a sidebar layout with nested routes.

## Client pages
- **Home (public):** hero (headline, image, "Get started" → login), why fitness matters (benefit cards: heart health, strength, mental health, longevity), how Thryve helps (track workouts, log body metrics, see progress), training types strip (strength, cardio, flexibility), final CTA, footer. Palette: emerald + charcoal with an orange CTA accent. Royalty-free (Unsplash/Pexels) images downloaded into `src/assets`.
- **Overview:** completed-workout stats (`/api/v1/workouts/stats/completed`), upcoming workouts (`/api/v1/workouts/range`), latest value for each metric type (`/api/v1/progress/latest/{type}`).
- **Workouts:** create, edit, delete, mark complete (`POST /{id}/complete`). Exercises can only be added in the create form; they are read-only afterwards (`UpdateWorkoutRequest` has no exercises). Lists paginate with a "Load more" button (`useInfiniteQuery`).
- **Progress (health metrics):** metric tabs (selected metric in `?metric=`), line chart per metric type over time plus a table, both fed by `/api/v1/progress/type/{type}` (full list, newest first — no pagination). Create and delete only (no backend update endpoint). Units are fixed per metric type in the frontend: WEIGHT/MUSCLE_MASS → kg, BODY_FAT → %, BMI → none, WAIST/CHEST/ARMS/LEGS → cm.
- **Goals:** placeholder until the backend exposes a goals API.
- All deletes require a confirmation dialog (backend deletes are permanent).

## Admin
- `/admin` is a role-guarded placeholder only. The frontend guard is cosmetic; real enforcement belongs to the backend.
- No mechanism exists yet to assign `ADMIN` (all users are created as `USER`), so the admin route is untested for now.

## Backend backlog (out of scope for frontend work)
- Goals controller (`UserGoal` entity exists, no API).
- `PUT` for progress metrics.
- Exercises in `UpdateWorkoutRequest`.
- Admin role assignment + admin endpoints guarded by `hasRole('ADMIN')`.

## Open decisions
- Production hosting is undecided. Once chosen: configure the SPA fallback (deep links like `/client/dashboard` must serve `index.html`), set `VITE_API_BASE_URL`, and add the prod origin to backend CORS and `app.oauth2.redirect-uri`.
