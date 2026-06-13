# NamloRides

A real-time ride-sharing demo built with React and TypeScript. Riders can request trips, drivers can accept and complete them, and both roles see live updates through Firebase Realtime Database. Completed, cancelled, and rejected rides are persisted to MockAPI for history.

## Features

- **Dual-role experience** — log in once, then choose Rider or Driver
- **Live ride sync** — ride state and driver GPS update in real time across browser tabs
- **Interactive map** — Leaflet map centered on Kathmandu with live driver tracking
- **Ride lifecycle** — request → accept/reject → start → complete/cancel
- **Ride history** — terminal rides saved to MockAPI and browsable with sorting/filtering

## Prerequisites

- **Node.js** 18 or later (20+ recommended)
- **npm** 9 or later
- A **Firebase** project with Realtime Database enabled
- A **MockAPI** endpoint for ride history (or your own REST API with the same shape)

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd task
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Firebase (Realtime Database)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.region.firebasedatabase.app/

# MockAPI — ride history persistence
VITE_MOCKAPI_BASE_URL=https://your-mockapi-id.mockapi.io/api/v1/your-resource
```

All variables are prefixed with `VITE_` so Vite exposes them to the client at build time.

### 3. Seed Firebase Realtime Database

Import the initial database state from `firebase-seed.json`:

1. Open the [Firebase Console](https://console.firebase.google.com/) → your project → **Realtime Database**
2. Use **Import JSON** (or paste manually) with the contents of `firebase-seed.json`

This creates two top-level nodes:

| Node | Purpose |
|------|---------|
| `currentRide` | Active ride state shared between rider and driver tabs |
| `driverLocation` | Driver's live GPS coordinates |

Set Realtime Database rules to allow read/write for development (tighten for production).

### 4. Start the dev server

```bash
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

### 5. Log in and test the ride flow

**Demo credentials**

| Field | Value |
|-------|-------|
| Email | `intern@namlotech.com` |
| Password | `namlo2026` |

**Suggested test flow** (use two browser tabs or windows):

1. Tab A — log in, select **Rider**, submit a ride request
2. Tab B — log in, select **Driver**, accept the request
3. Driver starts the ride, then completes it
4. Both tabs should reflect status changes in real time
5. Visit **History** to see the completed ride in MockAPI

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Architecture Overview

### High-level data flow

```
┌─────────────┐     realtime      ┌──────────────────────┐
│  Rider tab  │ ◄──────────────► │  Firebase Realtime   │
└─────────────┘                   │  Database            │
┌─────────────┐     realtime      │  (currentRide,       │
│  Driver tab │ ◄──────────────► │   driverLocation)    │
└─────────────┘                   └──────────┬───────────┘
                                             │ on terminal status
                                             ▼
                                  ┌──────────────────────┐
                                  │  MockAPI (REST)      │
                                  │  ride history        │
                                  └──────────────────────┘
```

**Firebase** handles ephemeral, real-time coordination (who requested what, current status, where the driver is). **MockAPI** handles durable history once a ride reaches a terminal state (`completed`, `cancelled`, or `rejected`).

### Architectural patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Service layer** | `src/services/firebase.ts`, `src/services/rideApi.ts` | Keeps pages free of transport details; Firebase and HTTP concerns live in one place |
| **Route guards** | `src/routes/` | `PrivateRoute`, `RoleRoute`, and `AlreadyAuthenticatedRoute` enforce auth and role access declaratively |
| **Declarative route config** | `src/app/router.tsx` | Protected routes are defined as data (`protectedRoutes[]`) and wrapped with guards via `buildProtectedRoutes()` |
| **Custom hooks** | `src/hooks/useRideHistory.ts` | Encapsulates fetch/loading/error state for the history page |
| **Centralized constants** | `src/const/paths.ts`, `src/const/enum.ts` | Single source of truth for URLs and role values — avoids string drift |
| **Session auth** | `src/lib/auth.ts` | Lightweight demo auth via `sessionStorage`; role is stored alongside the user after role selection |
| **Form validation** | react-hook-form + Zod | Typed, schema-driven validation on the login form |

### Layout and folder strategy

The codebase uses a **feature-oriented layout** under `src/`:

```
src/
├── app/              # App shell — router definition
├── pages/            # Route-level views (RiderPage, DriverPage, HistoryPage, …)
├── components/
│   ├── layout/       # Shared chrome (Layout, TopNav)
│   ├── Map/          # Leaflet map wrapper
│   ├── Rider/        # Rider-specific UI
│   ├── Driver/       # Driver-specific UI
│   └── ui/           # shadcn/ui primitives (Button, Card, Input, …)
├── routes/           # Auth/role guard components
├── services/         # External I/O (Firebase, MockAPI)
├── hooks/            # Reusable stateful logic
├── lib/              # Pure utilities (auth helpers, cn())
└── const/            # Enums and path constants
```

**Design choices behind this layout:**

- **Pages own orchestration** — `RiderPage` and `DriverPage` subscribe to Firebase, call service functions, and coordinate UI state. They do not talk to the database directly.
- **Role-specific components stay scoped** — `RideRequestForm` lives under `components/Rider/`, `DriverRequests` under `components/Driver/`, so each role's UI can evolve independently.
- **`@/` path alias** — configured in `vite.config.ts` and `tsconfig`, keeping imports short and consistent (`@/services/firebase`).
- **shadcn/ui + Tailwind CSS v4** — unstyled Radix primitives with Tailwind utility classes; dark zinc/amber theme applied consistently across pages.
- **Layout via React Router `<Outlet>`** — authenticated routes share `Layout` (top nav + outlet) without prop drilling.

### Ride state machine

Rides progress through a fixed set of statuses managed in Firebase:

```
idle → requested → accepted → active → completed
                 ↘ rejected
                 ↘ cancelled (rider, while requested)
```

When a ride hits a terminal status, the active page saves it to MockAPI via `saveRideToHistory()`, then clears `currentRide` with `clearCurrentRide()` so the next request starts fresh.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_FIREBASE_DATABASE_URL` | Yes | Realtime Database URL |
| `VITE_MOCKAPI_BASE_URL` | Yes* | REST endpoint for ride history (*app runs without it, but history will not load) |

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/) — dev server and bundler
- [React Router 7](https://reactrouter.com/) — client-side routing
- [Firebase Realtime Database](https://firebase.google.com/docs/database) — live ride sync
- [MockAPI](https://mockapi.io/) — REST persistence for ride history
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) — map rendering
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — styling and components
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — form handling and validation

## License

Private — internal use only.
