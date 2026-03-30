# FoodWalla — Frontend

React client for **FoodWalla**: food ordering, shops, cart, checkout (Razorpay), live order tracking (Socket.IO), and Google sign-in (Firebase). Built with **Vite** and **Tailwind CSS**.

---

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- The **FoodWalla backend** running (see [Backend setup](#backend-api) below)

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/<your-username>/FoodWalla.git
cd FoodWalla/frontend
```

Use your real GitHub URL if the remote differs.

---

## Step 2 — Install dependencies

From the `frontend` folder:

```bash
npm install
```

---

## Step 3 — Environment variables

Create a file named **`.env`** in the `frontend` directory (same level as `package.json`). Vite only exposes variables that start with **`VITE_`**.

Example:

```env
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
VITE_GEOAPIKEY=your_geoapify_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

| Variable | Used for |
|----------|----------|
| `VITE_FIREBASE_APIKEY` | Firebase Authentication (Google sign-in). Get it from [Firebase Console](https://console.firebase.google.com/) → Project settings → Your apps → Web app config. |
| `VITE_GEOAPIKEY` | Reverse geocoding via [Geoapify](https://www.geoapify.com/) (see `src/hooks/useGetCity.jsx`). Create a key in the Geoapify dashboard. |
| `VITE_RAZORPAY_KEY_ID` | Razorpay checkout (public key, safe in the browser). |

**Notes**

- Never commit `.env`. Add `.env` to `.gitignore` (it usually is already).
- After changing `.env`, restart the Vite dev server (`Ctrl+C`, then `npm run dev` again).

---

## Step 4 — Point the app at your API

The app talks to the REST API and Socket.IO server via **`serverUrl`** in `src/App.jsx` (default: `http://localhost:8000`).

1. Start the backend on the same host/port you configure (see backend `PORT`, often **8000**).
2. If your API runs elsewhere, update `serverUrl` in `src/App.jsx` to match (including **http vs https**).

The backend must allow **CORS** from your Vite origin (default dev URL: `http://localhost:5173`).

---

## Step 5 — Start the backend

From the repo root, in the **backend** folder (not `frontend`):

```bash
cd ../backend
npm install
```

Configure backend **`.env`** (MongoDB, JWT, email, Cloudinary, Razorpay secrets, etc.), then:

```bash
npm run dev
```

Keep this terminal open while you develop the frontend.

---

## Step 6 — Run the frontend (development)

With the backend already running, in **`frontend`**:

```bash
npm run dev
```

Open the URL Vite prints (typically **http://localhost:5173**). You should see the FoodWalla UI; sign-in and API calls require a working backend.

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Production build

```bash
npm run build
npm run preview
```

Deploy the **`dist/`** folder to any static host (Netlify, Vercel, S3, etc.). Set the same **`VITE_*`** variables in the host’s environment. Update **`serverUrl`** (or move it to `import.meta.env.VITE_API_URL` if you refactor) so production clients hit your deployed API.

---

## Tech stack

- React 19, React Router 7  
- Redux Toolkit, React Redux  
- Vite 7, Tailwind CSS 4  
- Axios, Socket.IO client  
- Firebase Auth, Leaflet / React-Leaflet, Recharts  
- Razorpay (checkout), React Icons  


---

