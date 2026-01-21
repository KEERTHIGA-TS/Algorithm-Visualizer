// ============================================
// backend/src/routes/progressRoutes.js
// ============================================
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  getProgress, 
  getDetailedStats 
} from "../controllers/progressController.js";

const router = express.Router();

router.get("/", authMiddleware, getProgress);
router.get("/stats", authMiddleware, getDetailedStats);

export default router;