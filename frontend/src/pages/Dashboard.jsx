// frontend/src/pages/Dashboard.jsx - CORRECTED IMPORTS
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useHistoryStore } from "../store/historyStore";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts"; // ✅ Skeleton REMOVED

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchHistory, stats, recentHistory } = useHistoryStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory().finally(() => setIsLoading(false));
  }, []);

  // ✅ FIXED: Proper route mapping
  const handleReplay = (item) => {
    let path;
    if (item.category === "sorting") {
      path = `/visualizer/${item.algorithm.key}`;     // ✅ selection, bubble
    } else if (item.category === "graphs") {
      path = `/graphs/${item.algorithm.key}`;                // ✅ bfs, dfs, dijkstra  
    } else if (item.category === "structures") {
      path = `/structures/${item.algorithm.key}`;     // ✅ stack, queue
    }
    navigate(`${path}?replay=${item._id}`);
  };

  const categoryColors = {
    sorting: "#ef4444",
    graphs: "#10b981",
    structures: "#3b82f6"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-xl text-gray-300">
            You've completed{" "}
            <span className="font-bold text-purple-400">{stats.total || 0}</span> visualizations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">📊 Total Sessions</h3>
            <div className="text-4xl font-bold text-white">{stats.total || 0}</div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">⚡ Avg Speed</h3>
            <div className="text-4xl font-bold text-white">
              {Math.round((stats.avgSpeed || 200) / 10) / 100}s/step
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">🎯 Most Practiced</h3>
            <div className="text-2xl font-bold text-white truncate">
              {stats.topAlgo || "None"}
            </div>
          </div>
        </div>

        {/* Recent + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity - UPDATED */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold mb-6">📜 Recent Activity</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No activity yet.</p>
                  <p className="text-sm mt-2">Complete some visualizations!</p>
                </div>
              ) : (
                recentHistory.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleReplay(item)} // ✅ Click to replay
                    className="w-full flex items-center space-x-4 p-4 bg-black/30 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/50 border border-transparent transition-all cursor-pointer text-left"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-purple-400 truncate">
                        {item.algorithm?.name || "Unknown"}
                        {item.operation && ` - ${item.operation}`}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.steps} steps • completed in {Math.round(item.duration / 1000)}s • speed {item.speed}ms
                      </div>

                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500 flex-shrink-0">
                        {new Date(item.completedAt).toLocaleDateString()}
                      </div>
                      <span className="text-xs text-purple-400">▶ Replay</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Category Chart */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold mb-6">📈 Category Breakdown</h2>
            {stats.categories && stats.categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.categories}>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.categories.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={categoryColors[entry._id] || "#8884d8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center bg-black/20 rounded-xl">
                <p className="text-gray-500 text-lg">No data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
