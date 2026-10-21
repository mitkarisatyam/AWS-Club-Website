# AWS SBG VIT Pune — Official Web Platform & Backend

The official, production-grade web platform and backend architecture for the **AWS Student Building Group (AWS SBG) at Vishwakarma Institute of Technology, Pune**.

This application combines high-performance interactive 3D WebGL graphics and smooth scroll animations with a modern multi-page architecture and a production REST API powered by Node.js, Express, and MongoDB.

---

## 🚀 Key Features

- **Interactive 3D WebGL Engine**: 30,000 real-time particles rendered with custom GLSL vertex and fragment shaders in Three.js, morphing seamlessly across 3D meshes  s users scroll.
- **GSAP ScrollSmoother Integration**: Physics-based smooth scrolling with inertia, scroll triggers, and custom cursor tracking.
- **Unified Responsive Design System**: Consistent cosmic dark aesthetic (`#000000`, AWS Orange `#FF9900`, Squid Ink `#232F3E`) shared across all 8 pages with accessible semantic HTML, high contrast, and responsive mobile navigation drawers.
- **Live GitHub REST API Explorer**: Real-time project repository showcase fetching live stars, forks, and programming languages from GitHub's public API, featuring instant keyword search, language filtering, source toggling (Developer, AWS Official, AWS Labs), and offline fallbacks.
- **Full-Stack REST Backend**: Robust Node.js + Express backend with MongoDB persistence for visitor feedback, event management, and student membership applications.
- **Live Community Feedback**: Interactive 5-star rating and review system with instant database persistence and real-time community testimonials feed.

---

## 🌟 Pages Overview

1. **Home (`/` or `index.html`)** — Immersive 3D interactive homepage with GLTF mesh sampling (Rocket, Satellite, Earth, Astronaut), 30,000 WebGL particles, custom GLSL shaders, GSAP ScrollSmoother, and hero navigation.
2. **About Us (`/about` or `about.html`)** — Mission, vision, core pillars, and community background of AWS SBG VIT Pune.
3. **Domains (`/domains` or `domains.html`)** — Comprehensive breakdown of club domains (Technical Cloud, Creative & UI/UX, Operations & Logistics, Media & Partnerships).
4. **Team (`/team` or `team.html`)** — Core executive team members, leadership designations, and verified LinkedIn profile badges.
5. **Events (`/events` or `events.html`)** — Upcoming workshops, bootcamps, and past sessions queried dynamically in real time from MongoDB (`/api/events`).
6. **Projects (`/projects` or `projects.html`)** — Public open-source showcase integrating live with the GitHub REST API, featuring instant search, language filter dropdowns, and multi-source exploration.
7. **Join Us (`/join` or `join.html`)** — Membership recruitment application with client/server validation, domain selection, and direct database storage (`POST /api/join`).
8. **Feedback (`/feedback` or `feedback.html`)** — Interactive 5-star rating and suggestion form that saves reviews to MongoDB (`POST /api/feedback`) and displays verified community reviews (`GET /api/feedback`).

---

## 🛠️ Technology Stack & Architecture

### Frontend
- **HTML5 & Semantic Markup**: Structured for SEO, accessibility, and high performance.
- **Vanilla CSS3 & Modern Tokens**: Custom design system in `shared.css` with CSS custom properties, glassmorphism cards, and fluid typography.
- **Three.js & WebGL**: High-performance 3D scene rendering, GLTF mesh sampling, and custom GLSL vertex/fragment shaders.
- **GSAP (GreenSock) & ScrollTrigger**: Smooth scroll physics, section pinning, and staggered micro-animations.
- **HTML5 Canvas**: Ambient lightweight starry particle system on subpages.
- **GitHub REST API**: Dynamic, asynchronous client-side repository query engine.

### Backend
- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js (v5)**: Clean RESTful API routing, JSON body parsing, CORS middleware, and custom static file delivery with clean URLs.
- **MongoDB & Mongoose (v9)**: Document database with strict schema validation, unique indexes, and sanitized queries.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/feedback` | Submit visitor feedback and 1-5 star ratings (validates name, email, rating, message). |
| `GET` | `/api/feedback` | Retrieve latest community feedback and testimonials from MongoDB. |
| `POST` | `/api/join` | Submit club membership applications (validates name, email, PRN, department, domain). |
| `GET` | `/api/events` | Query upcoming and past club events with optional `?type=Upcoming` filter. |
| `GET` | `/api/health` | Service health check returning uptime, timestamp, and database connection status. |

---

## 💻 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` OR a MongoDB Atlas cloud URI)

### 2. Configure Environment Variables
Copy `.env.example` to create your local `.env`:
```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/aws_sbg_vit
NODE_ENV=development
```
*(For cloud database, replace `MONGODB_URI` with your MongoDB Atlas connection string).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Initial Events & Feedback (Optional)
To pre-populate MongoDB with initial verified club events and reviews:
```bash
npm run seed
```

### 5. Run the Server
```bash
npm start
# or for development:
node server.js
```

Open your browser at:
```
http://localhost:8080/
```

---

## 🧪 Testing

The repository includes automated test suites for validation, schema integrity, and end-to-end HTTP endpoints:

- **Mongoose Schema & Validation Test**:
  ```bash
  npm test
  # or: node tests/test-backend.js
  ```
- **Live Server & Route Integration Test**:
  ```bash
  node tests/test-server-integration.js
  ```
- **In-Memory MongoDB Lifecycle Test**:
  ```bash
  node tests/test-mongodb-flow.js
  ```

---

## 🌐 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add `MONGODB_URI`.
4. Click **Deploy** (the included `vercel.json` configures the serverless deployment automatically).

### Deploying to Render / Railway
1. Create a **New Web Service** pointing to your repository.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Set Environment Variables: `PORT=8080`, `MONGODB_URI=<your-atlas-uri>`, `NODE_ENV=production`.
