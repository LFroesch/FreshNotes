import express from 'express';
import { getAllNotes, createNote, updateNote, deleteNote, getNoteById } from '../controllers/notesController.js';
const router = express.Router();

router.get("/", (getAllNotes))
router.post("/", (createNote))
router.put("/:id", (updateNote))
router.delete("/:id", (deleteNote))
router.get("/:id", (getNoteById))

export default router;