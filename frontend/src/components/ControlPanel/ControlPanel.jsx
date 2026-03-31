// components/ControlPanel/ControlPanel.jsx

export default function ControlPanel({
    start,
    restart,
    generate,
    togglePause,
    isPaused,
    isRunning,
    speed,
    setSpeed,
    size,
    setSize,
    input,
    setInput,
    useInput,
    isReplayMode = false
}) {
    // 🔒 Global lock during run OR replay (EXCEPT Start/Pause/Restart)
    const isDisabled = isRunning || isReplayMode;
    const disabledStyles = "opacity-40 cursor-not-allowed";

    return (
        <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-purple-400 font-semibold text-lg">Controls</h3>

            {/* ▶ Start & ⏸ Pause/Resume - ALWAYS AVAILABLE */}
            <div className="flex gap-3">
                <button className="btn-primary flex-1" onClick={start} disabled={isRunning}>
                    ▶ Start
                </button>
                <button className="btn-secondary flex-1" onClick={togglePause} disabled={!isRunning}>
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
            </div>

            {/* 🔁 Restart & 🔄 New Array */}
            <div className="flex gap-3">
                <button 
                    className={`btn-secondary flex-1 ${isReplayMode ? disabledStyles : ""}`} 
                    onClick={restart} 
                    disabled={isReplayMode}
                >
                    🔁 Restart
                </button>
                <button 
                    className={`btn-secondary flex-1 ${isDisabled ? disabledStyles : ""}`} 
                    onClick={generate} 
                    disabled={isDisabled}
                >
                    🔄 New Array
                </button>
            </div>

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

            {/* 📊 Array Size Slider - DISABLED */}
            <div className="space-y-1">
                <label className="text-sm text-gray-400">Array Size</label>
                <input
                    type="range"
                    min="5"
                    max="100"
                    value={size}
                    onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setSize(newSize);
                        generate(newSize); // 🔥 THIS LINE FIXES IT
                    }}
                    disabled={isDisabled}
                    className={`w-full transition-all rounded-lg appearance-none h-2 ${
                        isDisabled
                            ? "bg-gray-700 cursor-not-allowed opacity-50"
                            : "bg-gray-600 cursor-pointer accent-blue-500"
                    }`}
                />
                
            </div>

            {/* 📝 Custom Input - DISABLED */}
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="e.g. 5,3,8,1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isDisabled}
                    className={`w-full px-3 py-2 rounded-md border text-white placeholder-gray-500 focus:outline-none transition-all ${
                        isDisabled
                            ? "bg-black/30 border-white/10 cursor-not-allowed opacity-50"
                            : "bg-black/40 border-white/10 hover:bg-black/50 focus:border-blue-500/50"
                    }`}
                />
                <button 
                    className={`btn-secondary w-full ${isDisabled ? disabledStyles : ""}`} 
                    onClick={useInput}
                    disabled={isDisabled}
                >
                    ✅ Use Input
                </button>
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
