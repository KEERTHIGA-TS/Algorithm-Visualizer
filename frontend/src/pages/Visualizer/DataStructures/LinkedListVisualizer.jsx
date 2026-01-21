

// src/pages/Visualizer/LinkedListVisualizer.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useHistoryStore } from "../../../store/historyStore";

import LinkedListCanvas from "../../../components/Canvas/Data Structures/LinkedListCanvas";
import LinkedListControlPanel from "../../../components/ControlPanel/Data Structures/LinkedListControlPanel";
import PseudocodePanel from "../../../components/PseudocodePanel";
import ComplexityPanel from "../../../components/ComplexityPanel";
import ExplanationPanel from "../../../components/ExplanationPanel";

import { generateDS, parseCustomInput } from "../../../utils/generateDS";
import * as LinkedList from "../../../algorithms/structures/linkedList";

export default function LinkedListVisualizer() {
    /* ================= STATE ================= */
    const [structure, setStructure] = useState(generateDS("linkedlist", 8));
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
    const [showInsertHead, setShowInsertHead] = useState(false);
    const [showInsertTail, setShowInsertTail] = useState(false);
    const [showInsertAfter, setShowInsertAfter] = useState(false);
    const [showDeleteHead, setShowDeleteHead] = useState(false);
    const [showDeleteTail, setShowDeleteTail] = useState(false);
    const [showDeleteNode, setShowDeleteNode] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const [value, setValue] = useState("");
    const [index, setIndex] = useState("");

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
            const s = generateDS("linkedlist", 8);
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
        name: "Linked List Operations",
        description: "Insert, delete, traverse and search nodes visually.",
        complexity: {
            best: "O(1)",
            average: "O(n)",
            worst: "O(n)",
            space: "O(n)",
        },
    };

    /* ================= HELPERS ================= */
    const deepCloneLinkedList = (arr) => {
        if (!arr || arr.length === 0) return [];
        return arr.map(node => ({
            value: node.value,
            next: node.next  // This copies the index reference, which is what we want
        }));
    };
    const incrementStep = useCallback(() => {
        stepCountRef.current += 1;
    }, []);

    const loadReplay = async (id) => {
        const history = await getHistoryForReplay(id);
        if (!history?.replayData) return;

        const { initialInput, operationParams } = history.replayData;
        const replaySpeed = history.speed ?? 200; // ✅ Load saved speed

        setStructure(initialInput);
        structureRef.current = initialInput;
        initialStructureRef.current = [...initialInput];

        // ✅ Set speed from replay
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
                    arr: deepCloneLinkedList(structureRef.current), // ✅ DEEP CLONE
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
                            name: "Linked List",
                            key: "linkedlist",
                        },
                        operation: operationName,
                        steps: stepCountRef.current,
                        duration,
                        arraySize: structureRef.current.length,
                        speed: speed,
                        replayData: {
                            initialInput: deepCloneLinkedList(initialStructureRef.current), // ✅ Deep clone here too
                            operationParams: params,
                            finalOutput: deepCloneLinkedList(structureRef.current), // ✅ And here
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
            insertHead: () => runOperation(LinkedList.insertHeadOp, params, LinkedList.insertHeadPseudo, "insertHead"),
            insertTail: () => runOperation(LinkedList.insertTailOp, params, LinkedList.insertTailPseudo, "insertTail"),
            insertAfter: () => runOperation(LinkedList.insertAfterOp, params, LinkedList.insertAfterPseudo, "insertAfter"),
            deleteHead: () => runOperation(LinkedList.deleteHeadOp, {}, LinkedList.deleteHeadPseudo, "deleteHead"),
            deleteTail: () => runOperation(LinkedList.deleteTailOp, {}, LinkedList.deleteTailPseudo, "deleteTail"),
            deleteNode: () => runOperation(LinkedList.deleteNodeOp, params, LinkedList.deleteNodePseudo, "deleteNode"),
            search: () => runOperation(LinkedList.searchOp, params, LinkedList.searchPseudo, "search"),
            traverse: () => runOperation(LinkedList.traverseOp, {}, LinkedList.traversePseudo, "traverse"),
        };

        ops[opName]?.();
    };

    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(pauseRef.current);
    };

    /* ================= ACTIONS ================= */
    const insertHead = () => setShowInsertHead(true);
    const handleInsertHead = () => {
        const val = Number(value);
        if (!isNaN(val)) {
            runOperation(
                LinkedList.insertHeadOp,
                { value: val },
                LinkedList.insertHeadPseudo,
                "insertHead"
            );
            setShowInsertHead(false);
            setValue("");
        }
    };

    const insertTail = () => setShowInsertTail(true);
    const handleInsertTail = () => {
        const val = Number(value);
        if (!isNaN(val)) {
            runOperation(
                LinkedList.insertTailOp,
                { value: val },
                LinkedList.insertTailPseudo,
                "insertTail"
            );
            setShowInsertTail(false);
            setValue("");
        }
    };

    const insertAfter = () => setShowInsertAfter(true);
    const handleInsertAfter = () => {
        const idx = Number(index);
        const val = Number(value);

        if (!isNaN(idx) && !isNaN(val) && idx >= 0 && idx < structure.length) {
            runOperation(
                LinkedList.insertAfterOp,
                { index: idx, value: val },
                LinkedList.insertAfterPseudo,
                "insertAfter"
            );
            setShowInsertAfter(false);
            setIndex("");
            setValue("");
        }
    };

    const deleteHead = () => setShowDeleteHead(true);
    const handleDeleteHead = () => {
        if (structure.length > 0) {
            runOperation(
                LinkedList.deleteHeadOp,
                {},
                LinkedList.deleteHeadPseudo,
                "deleteHead"
            );
            setShowDeleteHead(false);
        }
    };

    const deleteTail = () => setShowDeleteTail(true);
    const handleDeleteTail = () => {
        if (structure.length > 0) {
            runOperation(
                LinkedList.deleteTailOp,
                {},
                LinkedList.deleteTailPseudo,
                "deleteTail"
            );
            setShowDeleteTail(false);
        }
    };

    const deleteNode = () => setShowDeleteNode(true);
    const handleDeleteNode = () => {
        const idx = Number(index);

        if (!isNaN(idx) && idx >= 0 && idx < structure.length) {
            runOperation(
                LinkedList.deleteNodeOp,
                { index: idx },
                LinkedList.deleteNodePseudo,
                "deleteNode"
            );
            setShowDeleteNode(false);
            setIndex("");
        }
    };

    const search = () => setShowSearch(true);
    const handleSearch = () => {
        const val = Number(value);

        if (!isNaN(val)) {
            runOperation(
                LinkedList.searchOp,
                { key: val },
                LinkedList.searchPseudo,
                "search"
            );
            setShowSearch(false);
            setValue("");
        }
    };

    const traverse = () =>
        runOperation(
            LinkedList.traverseOp,
            {},
            LinkedList.traversePseudo,
            "traverse"
        );

    const generate = () => {
        if (isReplayMode) return;

        const s = generateDS("linkedlist", 8);
        setStructure(s);
        structureRef.current = s;
        initialStructureRef.current = [...s];
        setExplanation("🆕 New linked list generated");
    };

    const useInput = () => {
        if (isReplayMode) return;

        try {
            const s = parseCustomInput(input, "linkedlist");
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
            {/* ===== MODALS ===== */}
            <Modal
                title="➤ Insert Head"
                isOpen={showInsertHead}
                onConfirm={handleInsertHead}
                onCancel={() => { setShowInsertHead(false); setValue(""); }}
            >
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Value (1-99)"
                    min="1"
                    max="99"
                />
                <div className="text-xs text-gray-400">Nodes: {structure.length}</div>
            </Modal>

            <Modal
                title="⬇️ Insert Tail"
                isOpen={showInsertTail}
                onConfirm={handleInsertTail}
                onCancel={() => { setShowInsertTail(false); setValue(""); }}
            >
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Value (1-99)"
                    min="1"
                    max="99"
                />
                <div className="text-xs text-gray-400">Nodes: {structure.length}</div>
            </Modal>

            <Modal
                title="➤ Insert After Index"
                isOpen={showInsertAfter}
                onConfirm={handleInsertAfter}
                onCancel={() => { setShowInsertAfter(false); setIndex(""); setValue(""); }}
            >
                <input
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400 mb-2"
                    placeholder="Index (0-based)"
                />
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Value (1-99)"
                    min="1"
                    max="99"
                />
            </Modal>

            <Modal
                title="🗑️ Delete Head"
                isOpen={showDeleteHead}
                onConfirm={handleDeleteHead}
                onCancel={() => setShowDeleteHead(false)}
            >
                <p className="text-gray-300">Delete the head node?</p>
                {structure.length > 0 && (
                    <div className="text-xs text-gray-400">
                        Current head: <span className="font-mono text-indigo-400">{structure[0]?.value}</span>
                    </div>
                )}
            </Modal>

            <Modal
                title="🗑️ Delete Tail"
                isOpen={showDeleteTail}
                onConfirm={handleDeleteTail}
                onCancel={() => setShowDeleteTail(false)}
            >
                <p className="text-gray-300">Delete the tail node?</p>
                {structure.length > 0 && (
                    <div className="text-xs text-gray-400">
                        Current tail: <span className="font-mono text-indigo-400">{structure[structure.length - 1]?.value}</span>
                    </div>
                )}
            </Modal>

            <Modal
                title="🗑️ Delete Node"
                isOpen={showDeleteNode}
                onConfirm={handleDeleteNode}
                onCancel={() => { setShowDeleteNode(false); setIndex(""); }}
            >
                <input
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Index (0-based)"
                />
                <div className="text-xs text-gray-400">List length: {structure.length}</div>
            </Modal>

            <Modal
                title="🔍 Search"
                isOpen={showSearch}
                onConfirm={handleSearch}
                onCancel={() => { setShowSearch(false); setValue(""); }}
            >
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Search value"
                />
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
                            {meta.name}
                        </h1>
                        <p className="text-gray-300 mb-6 leading-relaxed">{meta.description}</p>
                        <ComplexityPanel data={meta.complexity} />
                    </div>

                    <div className="bg-black/40 rounded-2xl p-8 backdrop-blur border border-white/10">
                        <LinkedListCanvas structure={structure} colors={colors} />
                    </div>

                    <ExplanationPanel text={explanation} />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <LinkedListControlPanel
                        insertHead={insertHead}
                        insertTail={insertTail}
                        insertAfter={insertAfter}
                        deleteHead={deleteHead}
                        deleteTail={deleteTail}
                        deleteNode={deleteNode}
                        traverse={traverse}
                        search={search}
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