// backend/src/routes/folderRoutes.js
import express from 'express';
import { 
  getAllFolders, 
  createFolder, 
  updateFolder, 
  deleteFolder, 
  getFolderById 
} from '../controllers/folderController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Protect all folder routes
router.use(protectRoute);

router.get("/", getAllFolders);
router.post("/", createFolder);
router.get("/:id", getFolderById);
router.put("/:id", updateFolder);
router.delete("/:id", deleteFolder);

export default router;