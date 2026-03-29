<div align="center">

  <img src="git-galaxy-frontend/public/Favicon.png" alt="AstroGit Logo" width="120" />

  # 🌌 AstroGit

  **Transform any GitHub profile into a stunning, interactive 3D galaxy.**

  Repositories become stars. Commits become asteroid belts. Pull requests become comets.
  Your code — visualized as a living cosmos.

  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
  [![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
  [![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

  <!-- Add your live URL here once ready -->
  <!-- [🚀 Live Demo](https://astrogit.vercel.app) · -->
  [📋 Report Bug](https://github.com/Muhammad-Hassan12/AstroGit/issues) · [💡 Request Feature](https://github.com/Muhammad-Hassan12/AstroGit/issues)

</div>

---

## 🌠 The Vision

Every developer is a creator of worlds — but we reduce that work to flat lists, plain text, and static heatmaps. **What if you could fly through your code?**

AstroGit maps real GitHub data into a custom 3D physics engine, transforming your profile into a navigable cosmic expanse powered by WebGL. It's designed to make the abstract beauty of software contributions **visible, interactive, and awe-inspiring**.

---

## ✨ Features

### 🕳️ Supermassive Core — The User
The center of every galaxy is a black hole representing the GitHub user. It displays a glassmorphic profile HUD with real-time stats (followers, following, bio) and serves as the camera reset anchor.

### 🌟 Star Systems — Repositories
Each repository is a glowing star. **Size** scales logarithmically with stargazer count. **Color** is mapped to the primary programming language — Python stars glow blue, Rust stars glow orange, and so on.

### ☄️ Comets — Active Pull Requests
Open PRs are rendered as high-speed comets in tilted elliptical orbits — code in motion, trying to merge.

### 🌑 Asteroid Belts — Commits
Total commits generate pre-allocated particle belts orbiting each star. More commits = denser asteroid belt.

### 🌫️ Contribution Nebula
Your 365-day contribution calendar shapes a dynamic space nebula around the core. Dense regions represent intense coding streaks.

### 🎯 Targeting Computer
Lock onto any moving star with a click. The camera smoothly warps across 3D space using `lerp`-based interpolation and rides alongside the orbiting body. A detailed Star Info Panel slides in with full repo stats and a direct GitHub link.

### 🔊 Procedural Space Audio
An ambient Web Audio API sound engine generates low-frequency drone tones. When locking onto a star, its language color is mathematically converted into a unique audio frequency.

### 🌈 Gravitational Lanes
Faint orbital rings visually connect repos sharing the same primary language — forming cosmic "language families."

### 📸 High-Res Export
Capture your galaxy as a high-resolution PNG. The engine temporarily boosts the pixel ratio to 3x, composites a watermark, and downloads the image.

### 📊 Real-Time HUD
- **Galaxy Stats** — Total repos, stars, forks, commits, and top languages at a glance
- **API Quota Dashboard** — Live remaining GitHub API rate limit with countdown timer
- **Search & Filter** — Filter visible stars by language, sort by stars/commits/name/updated
- **Map Legend** — In-app guide explaining what every visual element represents

---

## 🛠️ Tech Stack

AstroGit is a decoupled full-stack application — maximum frontend rendering performance with safe API secret handling on the backend.

| Layer | Technology | Purpose |
|---|---|---|
| **3D Engine** | Three.js + React Three Fiber | WebGL rendering, orbital mechanics |
| **Frontend** | Next.js 16, React 19, TypeScript | UI framework, type safety |
| **Post-Processing** | `@react-three/postprocessing` | Bloom, glow effects |
| **Styling** | Tailwind CSS v4 | Glassmorphism UI, responsive design |
| **Backend** | Python Flask + Gunicorn | API layer, data transformation |
| **Data Source** | GitHub GraphQL API | Repos, commits, contributions, profile |
| **Caching** | In-memory TTL Cache (120s) | Prevents API hammering |
| **Rate Limiting** | Flask-Limiter | 60 req/min global, 30/min per route |
| **Security** | CORS, Input Validation, ProxyFix | Production-hardened defaults |

---

## 💻 Local Development

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **GitHub Personal Access Token** ([create one here](https://github.com/settings/tokens)) with `read:user` and `repo` scopes

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammad-Hassan12/AstroGit.git
cd AstroGit
```

### 2. Backend Setup (Flask API)

```bash
cd git-galaxy-backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
echo "GITHUB_PAT=your_github_personal_access_token_here" > .env
echo "PORT=8000" >> .env
echo "FLASK_DEBUG=true" >> .env
echo "CORS_ORIGINS=http://localhost:3000" >> .env

# Start the Cosmic Engine
python app.py
```

> **API runs at:** `http://localhost:8000`

### 3. Frontend Setup (Next.js)

```bash
cd git-galaxy-frontend

# Install dependencies
npm install

# Connect to local backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Launch the Visualizer
npm run dev
```

> **App runs at:** `http://localhost:3000` — default profile loaded is **torvalds**

---

## ⌨️ Controls & Navigation

| Action | Control |
|---|---|
| **Rotate** | Left Click + Drag |
| **Zoom** | Scroll Wheel |
| **Lock on Star** | Click any star (Targeting Computer) |
| **Warp to Random Star** | <kbd>R</kbd> |
| **Reset View** | <kbd>Esc</kbd> |
| **Keyboard Shortcuts** | <kbd>?</kbd> |
| **View on GitHub** | Click "View on GitHub" in Star Info Panel |

---

## 🚀 Deployment

AstroGit is designed for a split deployment:

| Component | Recommended Host | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Connect GitHub repo, set `NEXT_PUBLIC_API_URL` env var |
| **Backend** | [Render](https://render.com) | Connect GitHub repo, set `GITHUB_PAT`, `CORS_ORIGINS`, `PORT` env vars |

> **Important:** Set `CORS_ORIGINS` on the backend to your Vercel production URL, and `NEXT_PUBLIC_API_URL` on Vercel to your Render backend URL.

---

## 📁 Project Structure

```
AstroGit/
├── git-galaxy-backend/
│   ├── app.py                  # Flask API — routes, GraphQL queries, caching
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables (gitignored)
│
├── git-galaxy-frontend/
│   ├── app/
│   │   ├── page.tsx            # Main page — search bar, layout
│   │   ├── layout.tsx          # Root layout, metadata, fonts
│   │   ├── GalaxyScene.tsx     # 3D canvas — stars, nebula, HUD, controls
│   │   ├── StarSystem.tsx      # Individual star with asteroids & comets
│   │   ├── BlackHole.tsx       # Central black hole with accretion disk
│   │   ├── ContributionNebula.tsx  # Contribution heatmap → 3D nebula
│   │   ├── GravitationalLanes.tsx  # Language-based orbital rings
│   │   ├── StarInfoPanel.tsx   # Detailed repo panel on star lock-on
│   │   ├── SearchFilter.tsx    # Filter & sort stars panel
│   │   ├── SoundEngine.tsx     # Web Audio API ambient sound
│   │   ├── ExportButton.tsx    # High-res PNG export
│   │   ├── UserProfileCard.tsx # GitHub profile card overlay
│   │   ├── RateLimitDashboard.tsx  # API quota progress bar
│   │   ├── AboutModal.tsx      # Credits & tech stack modal
│   │   ├── LegendModal.tsx     # Map legend modal
│   │   ├── types.ts            # TypeScript interfaces & utilities
│   │   └── globals.css         # Global styles & animations
│   │
│   ├── public/                 # Static assets (favicon, SVGs)
│   ├── package.json            # Node dependencies
│   └── next.config.ts          # Next.js configuration
│
└── README.md
```

---

## 👨‍💻 Creator

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Muhammad-Hassan12">
        <img src="https://github.com/Muhammad-Hassan12.png" width="100" style="border-radius: 50%;" alt="Syed Muhammad Hassan" />
        <br />
        <b>Syed Muhammad Hassan</b>
      </a>
      <br />
      <sub>AI Engineer & Co-Founder</sub>
      <br />
      <a href="https://github.com/Muhammad-Hassan12">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" />
      </a>
      <a href="https://www.linkedin.com/in/syed-muhammad-hassan-aa112928b/">
        <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" />
      </a>
    </td>
  </tr>
</table>

**Built by [AgenticEra Systems](https://www.linkedin.com/company/AgenticEra-Systems)** — AI-powered software engineering.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve AstroGit:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ and ☕ by <a href="https://github.com/Muhammad-Hassan12">Syed Muhammad Hassan</a> at <a href="https://www.linkedin.com/company/AgenticEra-Systems">AgenticEra Systems</a></sub>
  <br />
  <sub>If you found this project cool, consider giving it a ⭐!</sub>
</div>
