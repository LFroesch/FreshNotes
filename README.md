# FreshNotes 📝

Simple Markdown note-taking app with React frontend and Node.js backend.

## Stack
React • Tailwind CSS • Node.js • Express • MongoDB • Redis

## Setup

1. **Install & build**
   ```bash
   npm run build
   ```

2. **Environment**
   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

3. **Run**
   ```bash
   npm run dev  # Backend
   npm run dev  # Frontend (new terminal)
   ```

Visit `http://localhost:5173`