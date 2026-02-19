# ChessView ♟️

Next-Generation Chess Experience with Real-Time Video Interaction

[https://ChessView.org](https://ChessView.org)

**ChessView** is an innovative chess platform designed to bring "human" interaction back to online play. We combine deep chess analytics with WebRTC technology, creating a space where a player's profile is their digital legacy, and fair play is guaranteed by advanced multi-language backend systems.

## 🚀 Tech Stack

The project is built on a high-performance stack designed for scale, real-time stability, and security:
* **Frontend:** React 18, TypeScript, Vite.
* **Styling:** SCSS (Modular & Adaptive).
* **Backend (Core):** Go (Golang) — High-concurrency server, Matchmaking, WebSockets.
* **Performance Layer:** C++ (Low-level engine integration and move validation).
* **Data Science & Anti-Cheat:** Python (Game analysis, behavior modeling, and cheat detection).
* **Database:** Supabase (PostgreSQL) + Redis (Session & State caching).
* **Real-time Media:** WebRTC (Routed through a dedicated media server to prevent P2P IP leaks).

## ✨ Key Features

### 1. Social Identity & Profiles
* **Premium Customization:** Animated avatars, unique profile banners, and visual special effects.
* **Titles & Verification:** Official title support (GM, IM, FM) with automated FIDE rating synchronization.
* **Staff Transparency:** Dedicated badges for the founding team: CEO, CTO, Staff.

### 2. Fair Play 2.0
* **"Suspicion" Status:** Instead of instant bans, players with anomalous accuracy receive a "Under Suspicion" tag.
* **Python AI Anti-Cheat:** Real-time analysis of move distributions compared to engine top-lines.

### 3. Gameplay & Personalization
* **WebRTC Integration:** Built-in video/audio streaming to see your opponent.
* **Custom Game Modes:** Tools for users to create their own chess variants.
* **Visual Themes:** Extensive library of board styles, piece sets, and soundscapes.

### 4. Enterprise-Grade Security
* **Secure Auth:** Protection against session hijacking, cookie injection, and advanced data hashing.
* **FIDE Link:** Secure verification process to link real-world professional chess identities.

## 📂 Project Structure

```text
├── chess-server/         # Backend (Go): Core logic, Matchmaking, Socket.io
├── frontend/             # Frontend (React + TS + SCSS)
│   ├── src/              # Source files
│   ├── components/       # Reusable UI components
│   └── page-style/       # SCSS modules (aliased as @styles)
├── engine/               # C++ Core: Move validation and engine analysis
├── analytics/            # Python: Anti-cheat modules and data processing
└── README.md
```

##Frontend
```
├── cd frontend
├── npm run dev
```
##Backend
```
├── cd backend/chess-server
├── go run main.go
```
