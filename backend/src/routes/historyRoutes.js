// ============================================
// backend/src/routes/historyRoutes.js - ADD NEW ROUTE
// ============================================
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  saveHistory, 
  getRecentHistory, 
  getAllHistory,
  getStats,
  getHistoryById // ✅ NEW
} from "../controllers/historyController.js";

const router = express.Router();

router.post("/", authMiddleware, saveHistory);
router.get("/recent", authMiddleware, getRecentHistory);
router.get("/all", authMiddleware, getAllHistory);
router.get("/stats", authMiddleware, getStats);
router.get("/:id", authMiddleware, getHistoryById); // ✅ NEW

export default router;
