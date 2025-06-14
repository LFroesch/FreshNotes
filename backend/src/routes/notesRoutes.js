// backend/src/routes/notesRoutes.js
import express from 'express';
import { getAllNotes, createNote, updateNote, deleteNote, getNoteById } from '../controllers/notesController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Protect all note routes
router.use(protectRoute);

router.get("/", getAllNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/:id", getNoteById);

export default router;
