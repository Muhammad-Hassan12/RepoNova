<div align="center">
  <h1>🌌 GitGalaxy</h1>
  <p><b>A high-performance, 3D interactive cosmic visualization of your GitHub universe.</b></p>
  <p><i>Architected by Syed Muhammad Hassan | Built by AgenticEra Systems</i></p>
</div>

<br />

## 🌠 The Creative Vision

The GitHub universe is vast, and every developer is a creator of worlds. Traditionally, we look at code in raw lists, heatmaps, and plain text. But what if we could *fly* through it? 

**GitGalaxy** was built to reimagine open-source contributions as a physical, cosmic expanse. By mapping raw GitHub GraphQL data into a custom 3D physics engine, your repositories transform from a static dashboard into a dynamic, living solar system. It is designed to make the abstract beauty of software architecture visible, interactive, and awe-inspiring.

---

## 🚀 The Cosmic Engine (Core Features)

GitGalaxy doesn't just display data; it translates abstract metrics into gorgeous orbital mechanics and WebGL shaders in real-time.

* **🕳️ The Supermassive Core (User Profile):** The center of the galaxy represents the developer. Clicking the central Black Hole resets the camera viewport, and a glassmorphic HUD displays real-time profile data (followers, following, bio) fetched via the GitHub API.
* **🌟 Star Systems (Repositories):** Each public repository is rendered as a distinct star. 
    * **Mass & Scale:** Logarithmic math scales the size of the star based on its stargazer count.
    * **Spectral Hue:** The star's glowing color is directly mapped to the repository's primary programming language.
* **☄️ Comets (Active Pull Requests):** Open PRs are rendered as high-speed comets flying in highly elliptical, tilted orbits around their parent star, representing active code trying to merge.
* **🌑 Asteroid Belts (Commits):** Total repository commits generate dynamic, pre-allocated particle belts orbiting the star. 
* **🎯 Targeting Computer (Smooth Tracking):** Users can lock onto any moving star. The engine uses `THREE.Vector3.lerp()` to smoothly animate the camera across 3D space and ride alongside the orbiting body.

### ✨ Advanced Visuals & Audio
* **Contribution Nebulas:** Your 365-day contribution calendar shapes dynamic space nebulas in the background. Denser regions represent highly active coding streaks.
* **Procedural Space Audio:** An ambient Web Audio API sound engine generates generative drone tones. When locking onto a star, its language hex color is mathematically converted into a specific audio frequency.
* **Gravitational Lanes:** Faint orbital rings visually connect repositories that share the same primary programming language.

---

## 👨‍💻 Lead Architect And Ownership
### Architect:
**Syed Muhammad Hassan** *AI Developer/Engineer & Systems Engineer* 
* [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Muhammad-Hassan12)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/syed-muhammad-hassan-aa112928b)

### professional Assit and Ownership:
**AgenticEra Systems**
* [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/AgenticEra-Systems)

---

## 🛠️ System Architecture & Tech Stack

GitGalaxy is a decoupled full-stack application, ensuring maximum frontend rendering performance while safely handling API rate limits and secrets on the backend.

### Frontend (The Visualizer)
* **Framework:** Next.js (App Router) & React 19
* **3D Engine:** React Three Fiber (R3F) & Three.js
* **Post-Processing:** `@react-three/postprocessing` (Bloom, custom passes)
* **Styling & UI:** Tailwind CSS v4, Glassmorphism UI components

### Backend (The Data Pipeline)
* **Framework:** Python Flask with Gunicorn WSGI
* **Data Source:** GitHub GraphQL API (Cursor-based pagination)
* **Performance:** Custom In-Memory TTL Caching & `Flask-Limiter` for rate limiting
* **Security:** Environment variable isolation to protect Personal Access Tokens (PAT).

### AI-Assisted Architecture
The codebase was audited and optimized utilizing multi-agent orchestration via Antigravity IDE (powered by Claude Opus 4.6 and Gemini 3.1 Pro) to ensure strict WebGL memory management, garbage collection optimization within the `useFrame` loop, and robust REST API security.

---

## 💻 Local Development Setup

To run GitGalaxy locally, you must spin up both the Python backend and the Next.js visualizer.

### 1. Backend Setup (Flask API)
The backend securely queries GitHub and transforms the data for the 3D engine.

```bash
cd git-galaxy-backend

# Create and activate a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Configuration
# Create a .env file and add your GitHub Personal Access Token
# Note: Ensure the token has 'read:user' and 'repo' permissions.
echo "GITHUB_PAT=your_github_personal_access_token_here" > .env
echo "PORT=8000" >> .env
echo "FLASK_DEBUG=true" >> .env
echo "CORS_ORIGINS=http://localhost:3000" >> .env

# Ignite the cosmic engine
python app.py
```
The API will be available at *http://localhost:8000*

### 2. Frontend Setup (Next.js)
The frontend consumes the API and renders the WebGL scenes.

```bash
cd git-galaxy-frontend

# Install dependencies
npm install

# Connect to local backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Launch the visualizer
npm run dev
```
The app will be available at *http://localhost:3000*. The default profile loaded is *torvalds*.

## ⌨️ Controls & Navigation

* Left Click & Drag: Rotate the galaxy viewport.
* Scroll Wheel: Zoom in and out of the cosmos.
* Targeting Mode: Click on any star to lock the camera and open the Star Info Panel.
* **[R]** Key: Warp to a random star system.
* **[ESC]** Key: Disengage the targeting computer and return to the galactic core.
* **[?]** Key: Open the keyboard shortcuts overlay.
