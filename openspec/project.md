# Project Context

## Purpose
Build a local-first habit tracking app that foregrounds a calm, “no guilt” experience. The MVP must let users define up to three habits, view a monthly grid with today highlighted, and toggle completion with a single tap even while offline. Future phases introduce cloud sync, summaries, and monetization, but the core goal is effortless daily tracking.

## Tech Stack
- Next.js App Router + React 18 for the UI shell and routing.
- TypeScript (strict) for safety.
- Tailwind CSS + shadcn/ui + Framer Motion for styling and interactions.
- Zustand for lightweight state management.
- Dexie.js (IndexedDB) for offline persistence.
- date-fns for calendar utilities.
- Vitest, React Testing Library, and Playwright for verification.

## Project Conventions

### Code Style
Use TypeScript strict mode, 2-space indentation, and Prettier defaults. Component and feature folders follow `PascalCase`, hooks/stores use `camelCase`, and all modules export curated APIs through a feature-level `index.ts`. Tailwind utilities should be grouped semantically; Dexie access is isolated to `features/*/db.ts`.

### Architecture Patterns
The repository follows Feature-Sliced Design under `src/features` with shared UI under `src/components` and infrastructure helpers in `src/lib`. The app is local-first: all writes stay in IndexedDB via Dexie, while UI interacts with Zustand stores rather than calling Dexie directly. Future Pro work will add Supabase/Firebase sync, but MVP remains client-only.

### Testing Strategy
Colocate `*.test.ts(x)` files with the code they verify. Unit tests rely on Vitest + React Testing Library, stubbing Dexie via in-memory adapters. End-to-end smoke tests run with Playwright against the monthly grid and habit CRUD flows. CI enforces `pnpm test --coverage` and Playwright suites before merge.

### Git Workflow
Use feature branches off `main` and keep PRs scoped to a single slice. Commits follow Conventional Commits (e.g., `feat(habit): add streak counter`). PRs must include a summary, linked roadmap issue, screenshots/video for UI changes, test evidence (`pnpm test`, offline check), and notes for any Dexie schema bump.

## Domain Context
Habits are displayed as rows in a monthly calendar grid; one tap toggles completion and writes a `check` record. Each habit has metadata (title, icon, order, archived state). The design emphasizes low cognitive load: avoid punitive cues, overbearing reminders, or competitive features in the MVP.

## Important Constraints
- MVP must function entirely offline and store data locally.
- Habit count capped at three for the free tier until monetization lands.
- Avoid introducing network APIs, auth, or secret management before Phase 3.
- UI should be responsive and touch-friendly to support mobile PWA installs.

## External Dependencies
- IndexedDB via Dexie.js for persistence.
- shadcn/ui (Radix-based) components for accessible primitives.
- Potential future integrations: Supabase (auth + sync), Stripe/store billing, push notification services. None are active during MVP; document any additions in `tech_selection.md` and PR descriptions.
