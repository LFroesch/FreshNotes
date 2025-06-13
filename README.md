# FreshNotes 📝

A simple note-taking app built with React and Node.js.

## Tech Stack
- **Frontend:** React, Tailwind CSS + DaisyUI, React Router
- **Backend:** Node.js, Express, MongoDB, Upstash Redis (rate limiting)

## Quick Start

1. **Install dependencies**
   ```bash
   # Main Folder
   npm run build
   ```

2. **Setup environment**
   
   Create `.env` in backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

3. **Run the app**
   ```bash
   # Backend
   npm run dev
   
   # Frontend (new terminal)
   npm run dev
   ```

App runs on `http://localhost:5173` 🚀

---

*Educational project by Lucas*