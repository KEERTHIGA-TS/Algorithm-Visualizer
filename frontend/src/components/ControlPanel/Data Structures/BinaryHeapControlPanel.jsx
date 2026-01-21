// src/components/ControlPanel/Data Structures/BinaryHeapControlPanel.jsx

export default function BinaryHeapControlPanel({
    insert,
    deleteRoot,
    extractMin,
    extractMax,
    heapify,
    buildHeap,
    decreaseKey,
    increaseKey,
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
    isReplayMode
}) {
    // 🔒 Global lock during run OR replay
    const isDisabled = isRunning || isReplayMode;
    const disabledStyles = "opacity-40 cursor-not-allowed";

    return (
        <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-4">

            <h3 className="text-purple-400 font-semibold text-lg">
                🥔 Min-Heap Controls
            </h3>

            {/* 🔢 Heap Size */}
            <div className="bg-black/30 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Heap Size</div>
                <div className="text-2xl font-bold text-indigo-400">
                    {nodeCount}
                </div>
            </div>

            {/* ⏸ Pause / Resume */}
            <div className="flex gap-3">
                <button
                    className="btn-primary flex-1"
                    onClick={togglePause}
                    disabled={!isRunning}
                >
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
            </div>


            {/* 🔹 Core Operations */}
            <div className="grid grid-cols-2 gap-2">
                <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={insert} disabled={isDisabled}>
                    ➕ Insert
                </button>
                <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={deleteRoot} disabled={isDisabled}>
                    🗑️ Delete Root
                </button>
                <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={extractMin} disabled={isDisabled}>
                    ⬇️ Extract Min
                </button>
                <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={extractMax} disabled={isDisabled}>
                    ⬆️ Extract Max
                </button>
            </div>

            {/* 🔧 Advanced */}
            <div className="space-y-2">
                <h4 className="text-sm text-gray-400 font-medium">Advanced</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={heapify} disabled={isDisabled}>
                        🔧 Heapify
                    </button>
                    <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={buildHeap} disabled={isDisabled}>
                        🏗️ Build Heap
                    </button>
                    <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={decreaseKey} disabled={isDisabled}>
                        ▼ Decrease Key
                    </button>
                    <button className={`btn-secondary ${isDisabled ? disabledStyles : ""}`} onClick={increaseKey} disabled={isDisabled}>
                        ▲ Increase Key
                    </button>
                </div>
            </div>

            {/* 🔄 New Heap */}
            <button
                className={`btn-secondary w-full ${isDisabled ? disabledStyles : ""}`}
                onClick={generate}
                disabled={isDisabled}
            >
                🔄 New Heap
            </button>

            {/* 🧾 Input */}
            <div className="space-y-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isDisabled}
                    placeholder="e.g. 5,2,8,1,9,3"
                    className={`w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-white
                        placeholder-gray-500 focus:outline-none focus:border-blue-500/50
                        ${isDisabled ? disabledStyles : ""}
                    `}
                />
                <button
                    className={`btn-secondary w-full ${isDisabled ? disabledStyles : ""}`}
                    onClick={useInput}
                    disabled={isDisabled}
                >
                    ✅ Use Input
                </button>
            </div>

            {/* ⚡ Speed */}
            <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Speed</span>
                    <span className={isDisabled ? "text-gray-600" : ""}>
                        {speed < 150 ? "🐌 Slow" : speed < 350 ? "🐢 Normal" : "⚡ Fast"}
                    </span>
                </div>
                <input
                    type="range"
                    min="20"
                    max="500"
                    value={speed}
                    disabled={isDisabled}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className={`w-full h-2 bg-gray-700 rounded-lg appearance-none accent-blue-500
                        ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    `}
                />
            </div>

            {/* 🔄 Replay Indicator */}
            {isReplayMode && (
                <p className="text-xs text-purple-400 text-center font-medium">
                    🔒 Controls locked during replay
                </p>
            )}
        </div>
    );
}
