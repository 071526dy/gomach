# Development Log - Gomach

This log tracks the development progress, structural changes, and critical decisions for the Gomach project. It is intended to facilitate handovers between developers (human or AI).

## Project Overview
- **Name**: Gomach
- **Tech Stack**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Goal**: Gym matching app.

## Current Status (as of 2026-01-03)

### Core Features
- [x] Basic UI structure
- [x] Auth simulation (Welcome screen)
- [x] Match list and User profiles
- [x] Mobile/Desktop view switcher (integrated into `App.tsx`)

### Recent Changes
- **2026-01-03**: 
  - Refactored `src/app/App.tsx` to move the **Mobile/Desktop View Switcher** logic outside the authentication check. 
  - The switcher is now visible on the `Welcome` screen.
  - Removed early returns for unauthenticated users, moving the conditional rendering inside the responsive frame.
  - Initialized Git repository and pushed to `https://github.com/071526dy/gomach.git`.
  - Created `testing_guide.md` with instructions for Vercel deployment and testing pointers for external users.

## Technical Notes
- **View Switcher Implementation**: 
  - Uses `localStorage` (via `storage` lib) to persist auth, but the view mode is currently state-based in `App.tsx`.
  - Mobile frame simulates iPhone 8/SE dimensions (375x667).
- **Layout**: 
  - Uses a common container in `App.tsx` that switches between full-width (`desktop`) and fixed-size with a frame (`mobile`).

## Pending Items / Next Steps
1. [ ] Finalize match logic and database integration (currently simulated/local).
2. [ ] Add real authentication flow.
3. [ ] Improve responsive details on internal screens for mobile view.

---
*Note: Update this log after every significant change.*
