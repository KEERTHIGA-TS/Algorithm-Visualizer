// components/GraphControlPanel.jsx

export default function GraphControlPanel({
    start, 
    togglePause, 
    generate,
    nodes, 
    setNodes,
    startNode, 
    setStartNode,
    speed, 
    setSpeed,
    isRunning, 
    isPaused,
    algoMeta,
    isReplayMode
}) {
    // 🔒 Global lock during run OR replay (EXCEPT Start/Pause)
    const isDisabled = isRunning || isReplayMode;
    const disabledStyles = "opacity-40 cursor-not-allowed";

    return (
        <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-purple-400 font-semibold text-lg">Controls</h3>

            {/* Node Count Display */}
            <div className="text-center p-3 bg-black/30 rounded-xl border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">{nodes}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Graph Nodes</div>
            </div>

            {/* ▶ Start & ⏸ Pause/Resume - ALWAYS AVAILABLE */}
            <div className="flex gap-3">
                <button className="btn-primary flex-1" onClick={start} disabled={isRunning}>
                    ▶ Start
                </button>
                <button className="btn-secondary flex-1" onClick={togglePause} disabled={!isRunning}>
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
            </div>

            {/* 🔄 New Graph - DISABLED */}
            <button 
                className={`btn-secondary w-full ${isDisabled ? disabledStyles : ""}`} 
                onClick={generate} 
                disabled={isDisabled}
            >
                🔄 New Graph ({nodes} nodes)
            </button>

            {/* ⚡ Speed Slider - DISABLED */}
            <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Speed</span>
                    <span className={isDisabled ? "text-gray-600" : ""}>
                        {speed < 150 ? "Slow Execution" : speed < 350 ? "Moderate Execution" : "Fast Execution"}
                    </span>
                </div>
                <input
                    type="range" 
                    min="20" 
                    max="500" 
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    disabled={isDisabled}
                    className={`w-full transition-all rounded-lg appearance-none h-2 ${
                        isDisabled
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-600 cursor-pointer accent-purple-500"
                    }`}
                />
                
            </div>

            {/* 📊 Graph Size Slider - DISABLED */}
            <div className="space-y-1">
                <label className="text-sm text-gray-400">Graph Size</label>
                <input
                    type="range" 
                    min="4" 
                    max="12" 
                    value={nodes}
                    onChange={(e) => setNodes(Number(e.target.value))}
                    disabled={isDisabled}
                    className={`w-full transition-all rounded-lg appearance-none h-2 ${
                        isDisabled
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-600 cursor-pointer accent-blue-500"
                    }`}
                />
                
            </div>

            {/* Start Node Dropdown - DISABLED */}
            <div className="space-y-1">
                <label className="text-sm block mb-1">Start Node</label>
                <select
                    value={startNode}
                    onChange={(e) => setStartNode(Number(e.target.value))}
                    disabled={isDisabled}
                    className={`w-full px-3 py-2 rounded-md bg-black/70 border text-gray-200 text-sm focus:outline-none transition-all ${
                        isDisabled
                            ? "border-gray-800/50 bg-black/50 cursor-not-allowed opacity-60"
                            : "border-gray-800/50 hover:bg-black/75 focus:border-gray-500/50"
                    }`}
                >
                    {Array.from({ length: nodes }, (_, i) => (
                        <option key={i} value={i}>
                            Node {i}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dynamic Complexity & Description */}
            <div className="text-xs p-3 bg-black/30 rounded-lg border border-white/10 space-y-1">
                <div className="text-gray-300 font-medium">
                    Time: {algoMeta.complexity.best} | Space: {algoMeta.complexity.space}
                </div>
                <div className="text-gray-500 text-[10px] leading-tight">
                    {algoMeta.description}
                </div>
            </div>

            {/* 🔒 Replay Indicator */}
            {isReplayMode && (
                <p className="text-xs text-purple-400 text-center font-medium">
                    🔒 Controls locked during replay
                </p>
            )}
        </div>
    );
}
