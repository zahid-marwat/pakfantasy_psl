# PakFantasyPSL 🏏

PakFantasyPSL is a fantasy cricket platform crafted for the Pakistan Super League. Build squads under a salary cap, track live points, compete in private leagues, and chat with fans in real-time.

## Highlights
- **Squad Builder:** Draft 11-player teams under a live-updating credit cap with captain/vice-captain boosts.
- **Live Experience:** Match centre, rolling leaderboards, and a mock draft simulator for practice.
- **Real-Time Chat:** Socket.io powered global chat rebuilt with a sleeker UI and environment-aware socket config.
- **Admin Console:** Manage users and player pools with enriched glassmorphism styling.
- **Secure by Default:** Helmet hardening, Mongo sanitisation, rate limiting, and environment-driven secrets.

## Tech Stack
| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Framer Motion, Socket.io Client |
| Backend | Node.js, Express 5, Mongoose, Socket.io |
| Database | MongoDB (local or Atlas) |
| Tooling | ESLint, Git LFS, Vite Dev Server |

## System Requirements
- Node.js ≥ 20.x and npm ≥ 10.x
- MongoDB ≥ 6.0 (local instance or Atlas cluster)
- Git ≥ 2.40 with Git LFS ≥ 3.4 (`git lfs install`)
- Modern browser with ES2022 support (Chrome, Edge, Firefox, Safari)

## Quick Start
1. **Clone & Install**
	```bash
	git clone <repo-url>
	cd pakfantasy_psl

	cd backend
	npm install

	cd ../frontend
	npm install
	```
2. **Configure Environments**
	```bash
	# Backend
	cp backend/.env.example backend/.env
	# Frontend
	cp frontend/.env.example frontend/.env
	```
	Update the copies with your Mongo connection string, JWT secret, and desired client origins.
3. **Run the stack (separate terminals)**
	```bash
	# Backend
	cd backend
	npm start

	# Frontend
	cd ../frontend
	npm run dev
	```
4. Visit the Vite dev server URL (default `http://localhost:5173`). The backend listens on `PORT` (default `5000`).

## Environment Variables
### Backend (`backend/.env`)
| Key | Description |
| --- | --- |
| `PORT` | HTTP port for Express & Socket.io (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Strong secret for signing auth tokens |
| `CLIENT_ORIGIN` | Comma-separated list of trusted frontend origins for CORS & sockets |

### Frontend (`frontend/.env`)
| Key | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL for REST calls (e.g. `http://localhost:5000`) |
| `VITE_SOCKET_URL` | Socket.io server URL (defaults to `VITE_API_BASE_URL` if omitted) |

## Security Hardening
- **Helmet** delivers secure headers out of the box.
- **express-rate-limit** throttles login, registration, and password reset attempts.
- **express-mongo-sanitize** neutralises MongoDB operator injection.
- Credentials are normalised and validated before persistence; JWT secrets are environment driven.
- Request bodies are capped to 10kb to discourage payload abuse.

## Git LFS Readiness
The repository ships with `.gitattributes` entries for heavyweight assets (media, design files, archives). Install Git LFS once per machine, then any matching file you add is automatically stored as a pointer:
```bash
git lfs install
git add <your-large-file>
git commit -m "Add match highlight clip"
```
If you add new asset types, extend `.gitattributes` accordingly.

## Methodology & Architecture
- **API-First Design:** The backend exposes RESTful routes under `/api`, keeping responses JSON-only for easy client consumption.
- **Real-Time Layer:** Socket.io bridges live chat and match events; CORS and origins stay configurable through shared env variables.
- **Modular Domains:** Models and routes are grouped by domain (users, leagues, tournaments, teams) for clarity and future scaling.
- **UI System:** The refreshed UI leans on a tokenised design system (`index.css`) with reusable utilities, glassmorphism panels, and custom scrollbars.
- **Data Flow:** Client context (`AuthContext`) persists sessions locally and injects auth headers when required; shared helpers (`src/lib/api.js`, `src/lib/socket.js`) centralise connectivity concerns.
- **Dev Workflow:** Vite powers instant HMR, while linting ensures consistency (`npm run lint` in `frontend`). Seed scripts (`backend/seed*.js`) remain available for fixture data.

## Useful Scripts
| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm start` | Launch Express + Socket.io server |
| `backend` | `node seed.js` / `node seedTournament.js` | Populate sample data |
| `frontend` | `npm run dev` | Start Vite dev server with HMR |
| `frontend` | `npm run build` | Create production bundle |
| `frontend` | `npm run lint` | Check front-end code quality |

## Next Steps
- Add automated tests (Jest or Vitest) for routes and UI flows.
- Wire real cricket data feeds or scheduled simulations.
- Extend admin tooling with moderation controls for global chat.

Happy fantasy managing! 🏏
