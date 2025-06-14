// backend/src/controllers/folderController.js
import Folder from "../models/Folder.js";
import Note from "../models/Note.js";

export const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // Get note count for each folder
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        const noteCount = await Note.countDocuments({ 
          folderId: folder._id, 
          userId: req.user._id 
        });
        return {
          ...folder.toObject(),
          noteCount
        };
      })
    );
    
    res.status(200).json(foldersWithCounts);
  } catch (error) {
    console.error("Error in getAllFolders controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!folder) {
      return res.status(404).json({ message: "Folder not found!" });
    }
    
    // Get notes in this folder
    const notes = await Note.find({ 
      folderId: folder._id, 
      userId: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.json({
      folder,
      notes
    });
  } catch (error) {
    console.error("Error in getFolderById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const createFolder = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name?.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }
    
    // Check if folder with this name already exists for this user
    const existingFolder = await Folder.findOne({
      name: name.trim(),
      userId: req.user._id
    });
    
    if (existingFolder) {
      return res.status(400).json({ message: "Folder with this name already exists" });
    }
    
    const folder = new Folder({ 
      name: name.trim(),
      description: description?.trim() || "",
      color: color || "#00FF9D",
      userId: req.user._id 
    });

    const savedFolder = await folder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    console.error("Error in createFolder controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateFolder = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name?.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }
    
    // Check if another folder with this name exists (excluding current folder)
    const existingFolder = await Folder.findOne({
      name: name.trim(),
      userId: req.user._id,
      _id: { $ne: req.params.id }
    });
    
    if (existingFolder) {
      return res.status(400).json({ message: "Folder with this name already exists" });
    }
    
    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        name: name.trim(),
        description: description?.trim() || "",
        color: color || "#00FF9D"
      },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    
    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error("Error in updateFolder controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    
    // Move all notes in this folder to "no folder" (set folderId to null)
    await Note.updateMany(
      { folderId: req.params.id, userId: req.user._id },
      { folderId: null }
    );
    
    // Delete the folder
    await Folder.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    res.status(200).json({ message: "Folder deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteFolder controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}