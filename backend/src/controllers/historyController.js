// ============================================
// backend/src/controllers/historyController.js - UPDATED
// ============================================
import History from "../models/History.js";
import Progress from "../models/Progress.js";

export const saveHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      visualizationId,
      category,
      algorithm,
      operation, // ✅ NEW
      steps,
      duration,
      arraySize,
      speed,
      replayData // ✅ NEW
    } = req.body;

    const algoData = {
      name: algorithm.name || algorithm,
      key: algorithm.key || algorithm
    };

    const newHistory = await History.create({
      userId,
      visualizationId: visualizationId || null,
      category,
      algorithm: algoData,
      operation: operation || null, // ✅ NEW
      steps,
      duration,
      arraySize,
      speed: speed || 50,
      replayData: replayData || null, // ✅ NEW
      completedAt: new Date()
    });

    // Update progress
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        totals: { visualizationsCompleted: 0, totalTimeSpent: 0 },
        categories: { sorting: 0, graphs: 0, structures: 0 },
        algorithms: new Map()
      });
    }

    progress.totals.visualizationsCompleted += 1;
    progress.totals.totalTimeSpent += duration;
    progress.categories[category] = (progress.categories[category] || 0) + 1;

    const algoKey = algoData.key;
    progress.algorithms.set(algoKey, (progress.algorithms.get(algoKey) || 0) + 1);

    await progress.save();

    res.status(201).json({
      message: "History saved",
      history: newHistory
    });
  } catch (err) {
    console.error("Save history error:", err);
    res.status(500).json({ message: "Failed to save history" });
  }
};

export const getRecentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const recentHistory = await History.find({ userId })
      .sort({ completedAt: -1 })
      .select("algorithm operation steps duration speed completedAt arraySize category replayData")

    res.json({ recentHistory });
  } catch (err) {
    console.error("Get recent history error:", err);
    res.status(500).json({ message: "Failed to fetch recent history" });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const history = await History.findOne({ _id: id, userId });

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.json({ history });
  } catch (err) {
    console.error("Get history by id error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const getAllHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const allHistory = await History.find({ userId })
      .sort({ completedAt: -1 })
      .select("algorithm steps duration completedAt arraySize category");

    res.json({ history: allHistory });
  } catch (err) {
    console.error("Get all history error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.json({
        total: 0,
        avgSpeed: 0,
        topAlgo: "None",
        categories: []
      });
    }

    const avgSpeed = progress.totals.visualizationsCompleted
      ? progress.totals.totalTimeSpent / progress.totals.visualizationsCompleted
      : 0;

    const algoArray = Array.from(progress.algorithms.entries());
    const topAlgo = algoArray.sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    res.json({
      total: progress.totals.visualizationsCompleted,
      avgSpeed,
      topAlgo,
      categories: [
        { _id: 'sorting', count: progress.categories.sorting || 0 },
        { _id: 'graphs', count: progress.categories.graphs || 0 },
        { _id: 'structures', count: progress.categories.structures || 0 }
      ]
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
