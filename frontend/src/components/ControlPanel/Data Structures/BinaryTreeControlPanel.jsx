// src/components/ControlPanel/Data Structures/BinaryTreeControlPanel.jsx

export default function BinaryTreeControlPanel({
    insert,
    deleteNode,
    search,
    inorder,
    preorder,
    postorder,
    findMin,
    findMax,
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
    const isLocked = isRunning || isReplayMode;
    const disabledStyles = "opacity-40 cursor-not-allowed";

    return (
        <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-purple-400 font-semibold text-lg">
                🌳 Binary Tree Controls
            </h3>

            {/* Node Count */}
            <div className="bg-black/30 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Tree Size</div>
                <div className="text-2xl font-bold text-indigo-400">
                    {nodeCount}
                </div>
            </div>

            {/* Pause / Resume — ✅ ALWAYS AVAILABLE */}
            <div className="flex gap-3">
                <button
                    className="btn-primary flex-1"
                    onClick={togglePause}
                    disabled={!isRunning}
                >
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
            </div>

            {/* Core Operations */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                    onClick={insert}
                    disabled={isLocked}
                >
                    ➕ Insert
                </button>

                <button
                    className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                    onClick={deleteNode}
                    disabled={isLocked}
                >
                    ❌ Delete
                </button>

                <button
                    className={`btn-secondary col-span-2 ${isLocked ? disabledStyles : ""}`}
                    onClick={search}
                    disabled={isLocked}
                >
                    🔍 Search
                </button>

                <button
                    className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                    onClick={findMin}
                    disabled={isLocked}
                >
                    ⬇️ Find Min
                </button>

                <button
                    className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                    onClick={findMax}
                    disabled={isLocked}
                >
                    ⬆️ Find Max
                </button>
            </div>

            {/* Traversals */}
            <div className="space-y-2">
                <h4 className="text-sm text-gray-400 font-medium">Traversals</h4>

                <div className="grid grid-cols-1 gap-2">
                    <button
                        className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                        onClick={inorder}
                        disabled={isLocked}
                    >
                        🔄 Inorder (L-Root-R)
                    </button>

                    <button
                        className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                        onClick={preorder}
                        disabled={isLocked}
                    >
                        🔄 Preorder (Root-L-R)
                    </button>

                    <button
                        className={`btn-secondary ${isLocked ? disabledStyles : ""}`}
                        onClick={postorder}
                        disabled={isLocked}
                    >
                        🔄 Postorder (L-R-Root)
                    </button>
                </div>
            </div>

            {/* Generate New Tree */}
            <button
                className={`btn-secondary w-full ${isReplayMode ? disabledStyles : ""}`}
                onClick={generate}
                disabled={isReplayMode}
            >
                🔄 New Tree
            </button>

            {/* Custom Input */}
            <div className="space-y-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 50,30,70,20,40"
                    disabled={isReplayMode}
                    className={`w-full px-3 py-2 rounded-md border text-white placeholder-gray-500 focus:outline-none
                        ${isReplayMode
                            ? "bg-black/30 border-white/10 cursor-not-allowed opacity-50"
                            : "bg-black/40 border-white/10 focus:border-blue-500/50"
                        }`}
                />

                <button
                    className={`btn-secondary w-full ${isReplayMode ? disabledStyles : ""}`}
                    onClick={useInput}
                    disabled={isReplayMode}
                >
                    ✅ Use Input
                </button>
            </div>

            {/* Speed — 🔒 Locked during replay */}
            <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Speed</span>
                    <span className={isReplayMode ? "text-gray-600" : ""}>
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
                    disabled={isLocked}
                    className={`w-full transition-all rounded-lg appearance-none ${isLocked
                            ? "h-2 bg-gray-700 cursor-not-allowed opacity-50"
                            : "h-2 bg-gray-600 cursor-pointer accent-purple-500"
                        }`}
                />

                {/* 🔄 Replay Indicator */}
                {isReplayMode && (
                    <p className="text-xs text-purple-400 text-center font-medium">
                        🔒 Controls locked during replay
                    </p>
                )}
            </div>
        </div>
    );
}
