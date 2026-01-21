// ============================================
// backend/src/controllers/progressController.js
// ============================================
import Progress from "../models/Progress.js";

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
      progress = await Progress.create({
        userId,
        totals: { visualizationsCompleted: 0, totalTimeSpent: 0 },
        categories: { sorting: 0, graphs: 0, structures: 0 },
        algorithms: new Map()
      });
    }

    // Convert algorithms Map to object for JSON
    const algorithmsObj = Object.fromEntries(progress.algorithms);

    res.json({
      totals: progress.totals,
      categories: progress.categories,
      algorithms: algorithmsObj
    });
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};

export const getDetailedStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.json({
        total: 0,
        avgSpeed: 0,
        topAlgo: "None",
        totalTime: 0,
        categories: [],
        algorithms: []
      });
    }

    const avgSpeed = progress.totals.visualizationsCompleted
      ? progress.totals.totalTimeSpent / progress.totals.visualizationsCompleted
      : 0;

    const algoArray = Array.from(progress.algorithms.entries());
    const sortedAlgos = algoArray
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ algorithm: key, count }));

    const topAlgo = sortedAlgos[0]?.algorithm || "None";

    res.json({
      total: progress.totals.visualizationsCompleted,
      avgSpeed,
      topAlgo,
      totalTime: progress.totals.totalTimeSpent,
      categories: [
        { _id: 'sorting', count: progress.categories.sorting || 0 },
        { _id: 'graphs', count: progress.categories.graphs || 0 },
        { _id: 'structures', count: progress.categories.structures || 0 }
      ],
      algorithms: sortedAlgos
    });
  } catch (err) {
    console.error("Get detailed stats error:", err);
    res.status(500).json({ message: "Failed to fetch detailed stats" });
  }
};
