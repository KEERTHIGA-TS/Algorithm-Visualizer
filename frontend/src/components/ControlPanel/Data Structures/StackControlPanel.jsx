// src/components/ControlPanel/Data Structures/StackControlPanel.jsx

export default function StackControlPanel({
    push,
    pop,
    peek,
    isEmpty,
    traverse,
    size,
    togglePause,
    isPaused,
    isRunning,
    speed,
    setSpeed,
    input,
    setInput,
    useInput,
    generate,
    nodeCount,
    isReplayMode = false,
}) {
    // 🔒 Global lock during run OR replay
    const isDisabled = isRunning || isReplayMode;
    const disabledStyles = "opacity-40 cursor-not-allowed";

    return (
        <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-purple-400 font-semibold text-lg">
                Controls
            </h3>

            {/* Stack Size */}
            <div className="bg-black/30 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Stack Size</div>
                <div className="text-2xl font-bold text-indigo-400">
                    {nodeCount}
                </div>
            </div>

            {/* ⏸ Pause / Resume - ALWAYS ENABLED WHEN RUNNING */}
            <div className="flex gap-3">
                <button
                    className="btn-primary flex-1"
                    onClick={togglePause}
                    disabled={!isRunning}
                >
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
            </div>

            {/* 🗃️ Stack Operations - ALL DISABLED */}
            <div className="grid grid-cols-2 gap-2">
                <button 
                    className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} 
                    onClick={push} 
                    disabled={isDisabled}
                >
                    📥 Push
                </button>
                <button 
                    className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} 
                    onClick={pop} 
                    disabled={isDisabled}
                >
                    📤 Pop
                </button>
                <button 
                    className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} 
                    onClick={peek} 
                    disabled={isDisabled}
                >
                    👀 Peek
                </button>
                <button 
                    className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} 
                    onClick={isEmpty} 
                    disabled={isDisabled}
                >
                    ❓ isEmpty
                </button>
                <button 
                    className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} 
                    onClick={traverse} 
                    disabled={isDisabled}
                >
                    🔍 Traverse
                </button>
                <button 
                    className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} 
                    onClick={size} 
                    disabled={isDisabled}
                >
                    📏 Size
                </button>
            </div>

            {/* 🔄 Generate New - DISABLED */}
            <button
                className={`btn-secondary w-full ${isDisabled ? disabledStyles : ""}`}
                onClick={generate}
                disabled={isDisabled}
            >
                🔄 New Stack
            </button>

            {/* 📝 Custom Input - DISABLED */}
            <div className="space-y-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 5,3,8,1"
                    disabled={isDisabled}
                    className={`w-full px-3 py-2 rounded-md border text-white placeholder-gray-500 focus:outline-none
                        ${isDisabled 
                            ? "bg-black/30 border-white/10 cursor-not-allowed opacity-50" 
                            : "bg-black/40 border-white/10 focus:border-blue-500/50"
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

            {/* ⚡ Speed Slider — 🔒 LOCKED DURING REPLAY/RUN */}
            <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Speed</span>
                    <span className={isDisabled ? "text-gray-600" : ""}>
                        {speed < 150
                            ? "Slow Execution"
                            : speed < 350
                            ? "Moderate Execution"
                            : "Fast Execution"}
                    </span>
                </div>

                <input
                    type="range"
                    min="20"
                    max="500"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    disabled={isDisabled}
                    className={`w-full transition-all rounded-lg appearance-none ${
                        isDisabled
                            ? "h-2 bg-gray-700 cursor-not-allowed opacity-50"
                            : "h-2 bg-gray-600 cursor-pointer accent-purple-500"
                    }`}
                />

                
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
