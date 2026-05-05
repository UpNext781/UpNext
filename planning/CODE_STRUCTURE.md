# UpNext Code Structure

## /root
* `package.json`: Project dependencies and metadata.
* `.env`: Environment variables (API keys, secrets).
* `.gitignore`: Files to exclude from GitHub (like passwords).

## /frontend (React Native)
* `/src/components`: Reusable UI elements (Buttons, Hero Cards).
* `/src/screens`: Main pages (StageView, Login, SafetyDashboard).
* `/src/navigation`: App routing (how users move between screens).
* `/src/services`: API calls to the backend.

## /backend (Node.js)
* `/src/api`: Route handlers (e.g., /check-in, /subscribe).
* `/src/models`: Database schemas (User, Club, Lineup).
* `/src/sockets`: Real-time logic for the "Up Next" live updates.
* `/src/middleware`: Security and authentication checks.

## /assets
* `/images`: Profile placeholders and club icons.
* `/fonts`: Custom typography for the "nightlife" aesthetic.
