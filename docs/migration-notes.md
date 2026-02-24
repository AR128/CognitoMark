# Migration and Fixes Documentation

This document summarizes all work completed during the SQLite to MongoDB migration and the subsequent fixes and adjustments.

## 1) Docker and nginx removal
- Removed Docker Compose and nginx integration.
- Deleted Dockerfiles and .dockerignore files from backend and frontend.
- Updated the root README to remove Docker/nginx setup instructions.

## 2) Database migration (SQLite to MongoDB)
### Core changes
- Replaced the SQLite helper with a MongoDB connection and collection helpers.
- Introduced a counters collection to provide sequential numeric ids to match the existing API payloads.
- Rewrote all backend controllers to use MongoDB queries and aggregations.
- Added MongoDB indexes (unique ids, foreign key style fields, and query helpers).

### Backend files updated
- backend/src/db/database.js
- backend/src/db/initDb.js
- backend/src/controllers/adminController.js
- backend/src/controllers/sessionController.js
- backend/src/controllers/studentController.js
- backend/package.json
- backend/pnpm-workspace.yaml
- backend/.env
- README.md

### Environment variables
- Added MONGODB_URI to backend .env.
- Optional MONGODB_DB can be used to set the database name.

## 3) Runtime fixes after migration
### Sequence and duplicate id fixes
- Fixed sequence generation to be atomic with a fallback read.
- Added a counter sync step on startup to align counters with existing data.
- Added a repair script to reassign sequential ids to telemetry_events:
  - backend/scripts/repairTelemetryIds.js
- Added retry-safe telemetry inserts to avoid transient duplicate key errors.

### Click-frequency stability
- Adjusted click window handling to tolerate edge-case window ordering.
- Avoided 400 responses when click windows arrive after submission (no-op response).

### Mongo connection logging
- Added terminal logs to show when MongoDB is connected.

## 4) UI and export updates
### Click window interval
- Updated click window duration to 60 seconds (60000 ms).
- Admin dashboard label now uses the configured click window value.
- Session export includes the click window duration in the summary.
- Sessions export includes a Metadata sheet with click window duration.

### Frontend files updated
- frontend/.env
- frontend/src/screens/student/Exam.jsx
- frontend/src/screens/admin/Dashboard.jsx
- frontend/src/screens/admin/SessionDetail.jsx
- frontend/src/screens/admin/Sessions.jsx

## 5) New documentation
- Added backend database reference:
  - backend/README.md
- This migration and fixes documentation:
  - docs/migration-notes.md

## 6) Operational notes
- Restart both backend and frontend after .env changes.
- If you still encounter duplicate key errors, run:
  - node backend/scripts/repairTelemetryIds.js

## 7) Known limitations
- Fullscreen warning is browser enforced. Browsers only allow fullscreen
  requests when the call is directly tied to a user gesture (click/key press).
  Programmatic attempts outside that gesture will be rejected and log a warning.
  This does not affect backend data but can affect the UX if fullscreen is
  triggered outside a user action. Recommended practice is to bind fullscreen
  activation to a click or button press.
- Click-frequency 400 responses should be avoided in normal flows. The backend
  now adjusts overlapping or invalid time windows instead of rejecting them.
  If 400 errors still appear, they typically indicate malformed timestamps
  (non-ISO strings) or a session that is already submitted. In those cases,
  the request is treated as a no-op when the session is submitted, and other
  validation errors should be investigated by checking the request payload.
