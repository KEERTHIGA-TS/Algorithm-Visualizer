

// src/pages/Visualizer/BinaryHeapVisualizer.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useHistoryStore } from "../../../store/historyStore";

import BinaryHeapCanvas from "../../../components/Canvas/Data Structures/BinaryHeapCanvas";
import BinaryHeapControlPanel from "../../../components/ControlPanel/Data Structures/BinaryHeapControlPanel";
import PseudocodePanel from "../../../components/PseudocodePanel";
import ComplexityPanel from "../../../components/ComplexityPanel";
import ExplanationPanel from "../../../components/ExplanationPanel";

import { generateDS, parseCustomInput } from "../../../utils/generateDS";
import * as BinaryHeap from "../../../algorithms/structures/binaryHeap";

export default function BinaryHeapVisualizer() {
    /* ================= STATE ================= */
    const [structure, setStructure] = useState(generateDS("heap", 8));
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
    const [showInsertModal, setShowInsertModal] = useState(false);
    const [showIndexModal, setShowIndexModal] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [insertValue, setInsertValue] = useState("");
    const [indexValue, setIndexValue] = useState("");
    const [keyValue, setKeyValue] = useState("");

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
            const s = generateDS("heap", 8);
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
        name: "Binary Heap Operations",
        description: "Complete binary tree satisfying min-heap property (parent ≤ children).",
        complexity: {
            best: "O(1)",
            average: "O(log n)",
            worst: "O(n)",
            space: "O(n)",
        },
    };

    /* ================= HELPERS ================= */
    const incrementStep = useCallback(() => {
        stepCountRef.current += 1;
    }, []);

    const getNodeValue = (node) => {
        return typeof node === 'object' && node !== null ? (node.value ?? node) : node;
    };

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
                            name: "Binary Heap",
                            key: "binaryheap",
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
            insert: () => runOperation(BinaryHeap.insertOp, params, BinaryHeap.insertPseudo, "insert"),
            deleteRoot: () => runOperation(BinaryHeap.deleteOp, {}, BinaryHeap.deletePseudo, "deleteRoot"),
            extractMin: () => runOperation(BinaryHeap.extractMinOp, {}, BinaryHeap.extractMinPseudo, "extractMin"),
            extractMax: () => runOperation(BinaryHeap.extractMaxOp, {}, BinaryHeap.extractMaxPseudo, "extractMax"),
            heapify: () => runOperation(BinaryHeap.heapifyOp, params, BinaryHeap.heapifyPseudo, "heapify"),
            buildHeap: () => runOperation(BinaryHeap.buildHeapOp, {}, BinaryHeap.buildHeapPseudo, "buildHeap"),
            decreaseKey: () => runOperation(BinaryHeap.decreaseKeyOp, params, BinaryHeap.decreaseKeyPseudo, "decreaseKey"),
            increaseKey: () => runOperation(BinaryHeap.increaseKeyOp, params, BinaryHeap.increaseKeyPseudo, "increaseKey"),
        };

        ops[opName]?.();
    };

    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(pauseRef.current);
    };

    /* ================= ACTIONS ================= */
    const insert = () => {
        if (isReplayMode) return;
        setShowInsertModal(true);
    };
    
    const handleInsertConfirm = () => {
        const value = Number(insertValue);
        if (isNaN(value) || value < 1 || value > 99) {
            setExplanation("❌ Invalid value (1-99)!");
            return;
        }
        runOperation(
            BinaryHeap.insertOp,
            { value },
            BinaryHeap.insertPseudo,
            "insert"
        );
        setShowInsertModal(false);
        setInsertValue("");
    };

    const deleteRoot = () => {
        if (isReplayMode) return;
        runOperation(
            BinaryHeap.deleteOp,
            {},
            BinaryHeap.deletePseudo,
            "deleteRoot"
        );
    };

    const extractMin = () => {
        if (isReplayMode) return;
        runOperation(
            BinaryHeap.extractMinOp,
            {},
            BinaryHeap.extractMinPseudo,
            "extractMin"
        );
    };

    const extractMax = () => {
        if (isReplayMode) return;
        runOperation(
            BinaryHeap.extractMaxOp,
            {},
            BinaryHeap.extractMaxPseudo,
            "extractMax"
        );
    };

    const heapify = () => {
        if (isReplayMode) return;
        if (structure.length === 0) return setExplanation("Heap is empty!");
        const idx = Math.floor(Math.random() * structure.length);
        runOperation(
            BinaryHeap.heapifyOp,
            { index: idx },
            BinaryHeap.heapifyPseudo,
            "heapify"
        );
    };

    const buildHeap = () => {
        if (isReplayMode) return;
        runOperation(
            BinaryHeap.buildHeapOp,
            {},
            BinaryHeap.buildHeapPseudo,
            "buildHeap"
        );
    };

    const decreaseKey = () => {
        if (isReplayMode) return;
        if (structure.length === 0) return setExplanation("Heap is empty!");
        setModalMode("decrease");
        setShowIndexModal(true);
    };

    const increaseKey = () => {
        if (isReplayMode) return;
        if (structure.length === 0) return setExplanation("Heap is empty!");
        setModalMode("increase");
        setShowIndexModal(true);
    };

    const handleIndexConfirm = () => {
        const idx = Number(indexValue);
        const key = Number(keyValue);

        if (isNaN(idx) || idx < 0 || idx >= structure.length) {
            setExplanation(`❌ Invalid index (0-${structure.length - 1})`);
            return;
        }

        const currentValue = getNodeValue(structure[idx]);

        if (isNaN(key) || key < 1 || key > 99) {
            setExplanation("❌ Invalid key (1-99)");
            return;
        }

        if (modalMode === "decrease" && key >= currentValue) {
            setExplanation(`❌ Decrease Key: New value ${key} must be < current ${currentValue}`);
            return;
        }

        if (modalMode === "increase" && key <= currentValue) {
            setExplanation(`❌ Increase Key: New value ${key} must be > current ${currentValue}`);
            return;
        }

        const op = modalMode === "decrease" ? BinaryHeap.decreaseKeyOp : BinaryHeap.increaseKeyOp;
        const pseudo = modalMode === "decrease" ? BinaryHeap.decreaseKeyPseudo : BinaryHeap.increaseKeyPseudo;
        const opName = modalMode === "decrease" ? "decreaseKey" : "increaseKey";

        runOperation(op, { index: idx, newValue: key }, pseudo, opName);
        setShowIndexModal(false);
        setIndexValue("");
        setKeyValue("");
        setModalMode(null);
    };

    const generate = () => {
        if (isReplayMode) return;

        const s = generateDS("heap", 8);
        setStructure(s);
        structureRef.current = s;
        initialStructureRef.current = [...s];
        setExplanation("🆕 New heap generated");
    };

    const useInput = () => {
        if (isReplayMode) return;

        try {
            const s = parseCustomInput(input, "heap");
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

    const IndexModalContent = () => {
        const idx = Number(indexValue);
        const isValidIndex = idx >= 0 && idx < structure.length;
        const currentValue = isValidIndex ? getNodeValue(structure[idx]) : null;

        return (
            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-gray-300 mb-2">Index</label>
                    <input
                        type="number"
                        value={indexValue}
                        onChange={(e) => setIndexValue(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="e.g. 2"
                        min="0"
                        max={structure.length - 1}
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-300 mb-2">
                        {modalMode === "decrease" ? "📉 New Lower Value" : "📈 New Higher Value"}
                        {currentValue !== null && (
                            <span className="text-orange-400 font-mono bg-black/30 px-2 py-1 rounded ml-2 text-sm">
                                current: {currentValue}
                            </span>
                        )}
                    </label>
                    <input
                        type="number"
                        value={keyValue}
                        onChange={(e) => setKeyValue(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                        placeholder={modalMode === "decrease" ? `< ${currentValue ?? 'current'}` : `> ${currentValue ?? 'current'}`}
                        min="1"
                        max="99"
                    />
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                    <div>Heap size: {structure.length}</div>
                    {currentValue !== null && (
                        <div className={`p-2 rounded text-xs font-mono ${modalMode === "decrease"
                            ? 'bg-emerald-900/50 text-emerald-300'
                            : 'bg-amber-900/50 text-amber-300'
                            }`}>
                            {modalMode === "decrease"
                                ? `✅ Need value < ${currentValue}`
                                : `✅ Need value > ${currentValue}`
                            }
                        </div>
                    )}
                </div>
            </div>
        );
    };

    /* ================= RENDER ================= */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-6 py-8">
            {/* ===== INSERT MODAL ===== */}
            <Modal
                title="➕ Insert Value"
                isOpen={showInsertModal}
                onConfirm={handleInsertConfirm}
                onCancel={() => { setShowInsertModal(false); setInsertValue(""); }}
            >
                <input
                    type="number"
                    value={insertValue}
                    onChange={(e) => setInsertValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Value (1-99)"
                    min="1"
                    max="99"
                    autoFocus
                />
                <div className="text-xs text-gray-400">Heap size: {structure.length}</div>
            </Modal>

            {/* ===== INDEX MODAL (DECREASE/INCREASE KEY) ===== */}
            <Modal
                title={modalMode === "decrease" ? "▼ Decrease Key" : "▲ Increase Key"}
                isOpen={showIndexModal}
                onConfirm={handleIndexConfirm}
                onCancel={() => {
                    setShowIndexModal(false);
                    setIndexValue("");
                    setKeyValue("");
                    setModalMode(null);
                }}
            >
                <IndexModalContent />
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
                            🥔 {meta.name}
                        </h1>
                        <p className="text-gray-300 mb-6 leading-relaxed">{meta.description}</p>
                        <ComplexityPanel data={meta.complexity} />
                    </div>

                    <div className="bg-black/40 rounded-2xl p-8 backdrop-blur border border-white/10">
                        <BinaryHeapCanvas structure={structure} colors={colors} />
                    </div>

                    <ExplanationPanel text={explanation} />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <BinaryHeapControlPanel
                        insert={insert}
                        deleteRoot={deleteRoot}
                        extractMin={extractMin}
                        extractMax={extractMax}
                        heapify={heapify}
                        buildHeap={buildHeap}
                        decreaseKey={decreaseKey}
                        increaseKey={increaseKey}
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