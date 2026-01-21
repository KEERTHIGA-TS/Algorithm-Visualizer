// src/pages/Visualizer/QueueVisualizer.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useHistoryStore } from "../../../store/historyStore";

import QueueCanvas from "../../../components/Canvas/Data Structures/QueueCanvas";
import QueueControlPanel from "../../../components/ControlPanel/Data Structures/QueueControlPanel";
import PseudocodePanel from "../../../components/PseudocodePanel";
import ComplexityPanel from "../../../components/ComplexityPanel";
import ExplanationPanel from "../../../components/ExplanationPanel";

import { generateDS, parseCustomInput } from "../../../utils/generateDs";
import * as Queue from "../../../algorithms/structures/queue";

export default function QueueVisualizer() {
    /* ================= STATE ================= */
    const [structure, setStructure] = useState(generateDS("queue", 8));
    const [colors, setColors] = useState({});
    const [speed, setSpeed] = useState(200);
    const [input, setInput] = useState("");
    const [explanation, setExplanation] = useState("");
    const [currentLine, setCurrentLine] = useState(-1);
    const [currentPseudo, setCurrentPseudo] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isReplayMode, setIsReplayMode] = useState(false);

    const [searchParams] = useSearchParams();
    const replayId = searchParams.get('replay');
    const { saveHistory, getHistoryForReplay } = useHistoryStore();

    /* ================= MODALS ================= */
    const [showEnqueueModal, setShowEnqueueModal] = useState(false);
    const [enqueueValue, setEnqueueValue] = useState("");
    const [showDequeueModal, setShowDequeueModal] = useState(false);

    /* ================= REFS ================= */
    const structureRef = useRef(structure);
    const speedRef = useRef(speed);
    const pauseRef = useRef(false);
    const shouldStopRef = useRef(false);
    const stepCountRef = useRef(0);
    const initialStructureRef = useRef([]);
    const replayOperationRef = useRef({ name: null, params: {} });
    const hasReplayedRef = useRef(false);

    useEffect(() => { structureRef.current = structure; }, [structure]);
    useEffect(() => { speedRef.current = speed; }, [speed]);

    // ✅ Load replay on mount
    useEffect(() => {
        if (replayId) {
            loadReplay(replayId);
        } else {
            const s = generateDS("queue", 8);
            setStructure(s);
            structureRef.current = s;
            initialStructureRef.current = [...s];
        }
    }, [replayId]);

    useEffect(() => {
        if (isReplayMode && !hasReplayedRef.current) {
            hasReplayedRef.current = true;

            const timer = setTimeout(() => {
                triggerOperation(
                    replayOperationRef.current.name,
                    replayOperationRef.current.params
                );
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [isReplayMode]);

    /* ================= META ================= */
    const meta = {
        name: "Queue Operations (FIFO)",
        description: "First-In-First-Out data structure with enqueue and dequeue operations.",
        complexity: {
            best: "O(1)",
            average: "O(1)",
            worst: "O(n)",
            space: "O(n)",
        },
    };

    /* ================= HELPERS ================= */
    const incrementStep = useCallback(() => {
        stepCountRef.current += 1;
    }, []);

    const loadReplay = async (id) => {
        const history = await getHistoryForReplay(id);
        if (!history?.replayData) return;

        const { initialInput, operationParams } = history.replayData;
        const replaySpeed = history.speed ?? 200;

        setStructure(initialInput);
        structureRef.current = initialInput;
        initialStructureRef.current = [...initialInput];
        
        setSpeed(replaySpeed);
        speedRef.current = replaySpeed;

        hasReplayedRef.current = false;

        replayOperationRef.current = {
            name: history.operation,
            params: operationParams || {}
        };

        setExplanation(`🔄 Replay loaded: ${history.algorithm.name} (${replaySpeed}ms speed)`);
        setIsReplayMode(true);
    };

    const resetUI = useCallback(() => {
        setColors({});
        setExplanation("");
        setCurrentLine(-1);
        pauseRef.current = false;
        setIsPaused(false);
    }, []);

    const runOperation = useCallback(
        async (op, params = {}, pseudo = [], operationName = "") => {
            if (isRunning) return;

            setIsRunning(true);
            resetUI();
            setCurrentPseudo(pseudo);
            stepCountRef.current = 0;

            const startTime = Date.now();

            try {
                await op({
                    arr: [...structureRef.current],
                    setStructure,
                    setColors,
                    setExplanation,
                    speedRef,
                    pauseRef,
                    shouldStopRef,
                    setCurrentLine,
                    incrementStep,
                    ...params,
                });

                const duration = Date.now() - startTime;

                console.log("📊 Operation finished:", {
                    operation: operationName,
                    steps: stepCountRef.current,
                    duration,
                    speed: speed,
                    replay: isReplayMode
                });

                // ✅ SAVE HISTORY ONLY IF NOT REPLAY
                if (!isReplayMode) {
                    await saveHistory({
                        category: "structures",
                        algorithm: {
                            name: "Queue",
                            key: "queue",
                        },
                        operation: operationName,
                        steps: stepCountRef.current,
                        duration,
                        arraySize: structureRef.current.length,
                        speed: speed,
                        replayData: {
                            initialInput: [...initialStructureRef.current],
                            operationParams: params,
                            finalOutput: [...structureRef.current],
                        },
                    });
                }

            } finally {
                setIsRunning(false);
            }
        },
        [isRunning, resetUI, saveHistory, isReplayMode, speed]
    );

    // ✅ Helper to trigger operations programmatically
    const triggerOperation = (opName, params) => {
        const ops = {
            enqueue: () => runOperation(Queue.enqueueOp, params, Queue.enqueuePseudo, "enqueue"),
            dequeue: () => runOperation(Queue.dequeueOp, {}, Queue.dequeuePseudo, "dequeue"),
            peekFront: () => runOperation(Queue.peekFrontOp, {}, Queue.peekFrontPseudo, "peekFront"),
            peekRear: () => runOperation(Queue.peekRearOp, {}, Queue.peekRearPseudo, "peekRear"),
            isEmpty: () => runOperation(Queue.isEmptyOp, {}, Queue.isEmptyPseudo, "isEmpty"),
            traverse: () => runOperation(Queue.traverseOp, {}, Queue.traversePseudo, "traverse"),
        };

        ops[opName]?.();
    };

    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(pauseRef.current);
    };

    /* ================= ACTIONS ================= */
    const enqueue = () => setShowEnqueueModal(true);
    const handleEnqueueConfirm = () => {
        const value = Number(enqueueValue);
        if (isNaN(value)) {
            setExplanation("❌ Invalid value!");
            return;
        }
        runOperation(
            Queue.enqueueOp,
            { value },
            Queue.enqueuePseudo,
            "enqueue"
        );
        setShowEnqueueModal(false);
        setEnqueueValue("");
    };

    const dequeue = () => {
        if (structure.length === 0) {
            setExplanation("⚠️ Queue is empty");
            return;
        }
        setShowDequeueModal(true);
    };
    const handleDequeueConfirm = () => {
        runOperation(
            Queue.dequeueOp,
            {},
            Queue.dequeuePseudo,
            "dequeue"
        );
        setShowDequeueModal(false);
    };

    const peekFront = () => runOperation(
        Queue.peekFrontOp,
        {},
        Queue.peekFrontPseudo,
        "peekFront"
    );

    const peekRear = () => runOperation(
        Queue.peekRearOp,
        {},
        Queue.peekRearPseudo,
        "peekRear"
    );

    const isEmpty = () => runOperation(
        Queue.isEmptyOp,
        {},
        Queue.isEmptyPseudo,
        "isEmpty"
    );

    const traverse = () => runOperation(
        Queue.traverseOp,
        {},
        Queue.traversePseudo,
        "traverse"
    );

    const generate = () => {
        if (isReplayMode) return;

        const s = generateDS("queue", 8);
        setStructure(s);
        structureRef.current = s;
        initialStructureRef.current = [...s];
        setExplanation("🆕 New queue generated");
    };

    const useInput = () => {
        if (isReplayMode) return;

        try {
            const s = parseCustomInput(input, "queue");
            setStructure(s);
            structureRef.current = s;
            initialStructureRef.current = [...s];
            setExplanation("✅ Custom input applied");
        } catch {
            setExplanation("❌ Invalid input");
        }
    };

    /* ================= MODAL ================= */
    const Modal = ({ title, isOpen, onConfirm, onCancel, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-black/95 border border-white/20 rounded-2xl p-6 w-full max-w-sm">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">{title}</h3>
                    <div className="space-y-3 mb-6">{children}</div>
                    <div className="flex gap-2">
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                        >
                            ✅ Confirm
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* ================= RENDER ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-6 py-8">
            {/* ===== ENQUEUE MODAL ===== */}
            <Modal
                title="➡️ Enqueue"
                isOpen={showEnqueueModal}
                onConfirm={handleEnqueueConfirm}
                onCancel={() => {
                    setShowEnqueueModal(false);
                    setEnqueueValue("");
                }}
            >
                <input
                    type="number"
                    value={enqueueValue}
                    onChange={(e) => setEnqueueValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Value (1-99)"
                    min="1"
                    max="99"
                    autoFocus
                />
                <div className="text-xs text-gray-400">Queue size: {structure.length}</div>
            </Modal>

            {/* ===== DEQUEUE MODAL ===== */}
            <Modal
                title="⬅️ Dequeue"
                isOpen={showDequeueModal}
                onConfirm={handleDequeueConfirm}
                onCancel={() => setShowDequeueModal(false)}
            >
                <p className="text-gray-300">Remove the front element?</p>
                {structure.length > 0 && (
                    <div className="text-xs text-gray-400">
                        Front value: <span className="font-mono text-indigo-400">{structure[0]?.value}</span>
                    </div>
                )}
            </Modal>

            {/* ===== MAIN LAYOUT ===== */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <div className="bg-black/40 rounded-2xl p-6 backdrop-blur border border-white/10">
                        {/* ===== REPLAY BANNER ===== */}
                        {isReplayMode && (
                            <div className="mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl flex items-center justify-center">
                                <span className="text-purple-300 font-semibold">
                                    🔄 Replay Mode - Auto-starting...
                                </span>
                            </div>
                        )}
                        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            🎫 {meta.name}
                        </h1>
                        <p className="text-gray-300 mb-6 leading-relaxed">{meta.description}</p>
                        <ComplexityPanel data={meta.complexity} />
                    </div>

                    <div className="bg-black/40 rounded-2xl p-8 backdrop-blur border border-white/10">
                        <QueueCanvas structure={structure} colors={colors} />
                    </div>

                    <ExplanationPanel text={explanation} />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <QueueControlPanel
                        enqueue={enqueue}
                        dequeue={dequeue}
                        peekFront={peekFront}
                        peekRear={peekRear}
                        isEmpty={isEmpty}
                        traverse={traverse}
                        togglePause={togglePause}
                        isPaused={isPaused}
                        isRunning={isRunning}
                        speed={speed}
                        setSpeed={setSpeed}
                        input={input}
                        setInput={setInput}
                        useInput={useInput}
                        generate={generate}
                        nodeCount={structure.length}
                        isReplayMode={isReplayMode}
                    />

                    <PseudocodePanel code={currentPseudo} currentLine={currentLine} />
                </div>
            </div>
        </div>
    );
}