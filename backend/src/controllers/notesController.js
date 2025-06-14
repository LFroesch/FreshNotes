// backend/src/controllers/notesController.js
import Note from "../models/Note.js";
import Folder from "../models/Folder.js";

export async function getAllNotes(req, res) {
  try {
    const { folderId } = req.query;
    
    let query = { userId: req.user._id };
    
    // If folderId is provided, filter by it
    if (folderId) {
      if (folderId === 'null' || folderId === 'none') {
        // Get notes that are not in any folder
        query.folderId = null;
      } else {
        query.folderId = folderId;
      }
    }
    
    const notes = await Note.find(query)
      .populate('folderId', 'name color')
      .sort({ createdAt: -1 });
      
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).populate('folderId', 'name color');
    
    if (!note) return res.status(404).json({ message: "Note not found!" });
    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, priority = 'medium', folderId, color } = req.body;
    
    // Validate priority
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }
    
    // If folderId is provided, verify it exists and belongs to user
    if (folderId && folderId !== 'null') {
      const folder = await Folder.findOne({
        _id: folderId,
        userId: req.user._id
      });
      
      if (!folder) {
        return res.status(400).json({ message: "Invalid folder" });
      }
    }
    
    const note = new Note({ 
      title, 
      content, 
      priority,
      color: color || "#00FF9D",
      folderId: folderId && folderId !== 'null' ? folderId : null,
      userId: req.user._id 
    });

    const savedNote = await note.save();
    const populatedNote = await Note.findById(savedNote._id)
      .populate('folderId', 'name color');
    
    res.status(201).json(populatedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, priority, folderId, color } = req.body;
    
    // Validate priority if provided
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }
    
    // If folderId is provided, verify it exists and belongs to user
    if (folderId && folderId !== 'null' && folderId !== null) {
      const folder = await Folder.findOne({
        _id: folderId,
        userId: req.user._id
      });
      
      if (!folder) {
        return res.status(400).json({ message: "Invalid folder" });
      }
    }
    
    const updateData = { title, content };
    if (priority) updateData.priority = priority;
    if (color) updateData.color = color;
    if (folderId !== undefined) {
      updateData.folderId = folderId && folderId !== 'null' ? folderId : null;
    }
    
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true }
    ).populate('folderId', 'name color');

    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}