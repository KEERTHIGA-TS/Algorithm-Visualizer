// ============================================
// backend/src/models/Progress.js
// ============================================
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    unique: true
  },
  totals: {
    visualizationsCompleted: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }
  },
  categories: {
    sorting: { type: Number, default: 0 },
    graphs: { type: Number, default: 0 },
    structures: { type: Number, default: 0 }
  },
  algorithms: { 
    type: Map, 
    of: Number 
  }
}, {
  timestamps: true
});

export default mongoose.model("Progress", progressSchema);
