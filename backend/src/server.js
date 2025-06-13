import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import cors from 'cors';
import path from 'path';

// .env and Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
if(process.env.NODE_ENV !== 'production') {
  app.use(cors());
}
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use("/api/notes", notesRoutes)

if(process.env.NODE_ENV === 'production') {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend',"dist","index.html"));
  })
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
    console.log('Press Ctrl+C to stop the server');
  });
})