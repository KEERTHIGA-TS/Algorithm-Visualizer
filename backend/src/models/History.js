// ============================================
// backend/src/models/History.js - UPDATED WITH REPLAY DATA
// ============================================
import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  visualizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Visualizations" 
  },
  category: { 
    type: String, 
    enum: ["sorting", "graphs", "structures"], 
    required: true 
  },
  algorithm: {
    name: { type: String, required: true },
    key: { type: String, required: true }
  },
  operation: { type: String }, // ✅ NEW: e.g., "insertHead", "deleteNode"
  steps: { type: Number, required: true },
  duration: { type: Number, required: true },
  arraySize: { type: Number },
  speed: { type: Number, default: 50 },
  
  // ✅ NEW: Replay data
  replayData: {
    initialInput: mongoose.Schema.Types.Mixed, // Original array/structure
    operationParams: mongoose.Schema.Types.Mixed, // e.g., { value: 42, index: 3 }
    finalOutput: mongoose.Schema.Types.Mixed // Result after operation
  },
  
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model("History", historySchema);