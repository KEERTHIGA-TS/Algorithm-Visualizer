// src/pages/Visualizer/BinaryTreeVisualizer.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useHistoryStore } from "../../../store/historyStore";


import BinaryTreeCanvas from "../../../components/Canvas/Data Structures/BinaryTreeCanvas";
import BinaryTreeControlPanel from "../../../components/ControlPanel/Data Structures/BinaryTreeControlPanel";
import PseudocodePanel from "../../../components/PseudocodePanel";
import ComplexityPanel from "../../../components/ComplexityPanel";
import ExplanationPanel from "../../../components/ExplanationPanel";


import { generateDS, parseCustomInput } from "../../../utils/generateDS";
import * as BinaryTree from "../../../algorithms/structures/binaryTree";


export default function BinaryTreeVisualizer() {
    /* ================= STATE ================= */
    const [structure, setStructure] = useState(generateDS("binarytree", 7));
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
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [insertValue, setInsertValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [deleteValue, setDeleteValue] = useState("");


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
            const s = generateDS("binarytree", 7);
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
        name: "Binary Tree Operations",
        description: "Hierarchical data structure with insert, search, and traversal operations.",
        complexity: {
            best: "O(log n)",
            average: "O(log n)",
            worst: "O(n)",
            space: "O(n)",
        },
    };


    /* ================= HELPERS ================= */
    // Add this helper function at the top of BinaryTreeVisualizer.jsx
    const deepCloneTree = (arr) => {
        if (!arr || arr.length === 0) return [];
        return arr.map(node => ({
            value: node.value,
            left: node.left,
            right: node.right
        }));
    };
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
                    arr: deepCloneTree(structureRef.current),  // ✅ DEEP CLONE
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
                            name: "Binary Tree",
                            key: "binarytree",
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
            insert: () => runOperation(BinaryTree.insertOp, params, BinaryTree.insertPseudo, "insert"),
            delete: () => runOperation(BinaryTree.deleteOp, params, BinaryTree.deletePseudo, "delete"),
            search: () => runOperation(BinaryTree.searchOp, params, BinaryTree.searchPseudo, "search"),
            inorder: () => runOperation(BinaryTree.inorderOp, {}, BinaryTree.inorderPseudo, "inorder"),
            preorder: () => runOperation(BinaryTree.preorderOp, {}, BinaryTree.preorderPseudo, "preorder"),
            postorder: () => runOperation(BinaryTree.postorderOp, {}, BinaryTree.postorderPseudo, "postorder"),
            findMin: () => runOperation(BinaryTree.findMinOp, {}, BinaryTree.findMinPseudo, "findMin"),
            findMax: () => runOperation(BinaryTree.findMaxOp, {}, BinaryTree.findMaxPseudo, "findMax"),
        };


        ops[opName]?.();
    };


    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(pauseRef.current);
    };


    /* ================= ACTIONS ================= */
    const insert = () => setShowInsertModal(true);
    const handleInsertConfirm = () => {
        const value = Number(insertValue);
        if (!isNaN(value)) {
            // ✅ Save the state BEFORE the operation
            initialStructureRef.current = [...structureRef.current];

            runOperation(
                BinaryTree.insertOp,
                { value },
                BinaryTree.insertPseudo,
                "insert"
            );
            setShowInsertModal(false);
            setInsertValue("");
        }
    };


    const deleteNode = () => setShowDeleteModal(true);
    const handleDeleteConfirm = () => {
        const key = Number(deleteValue);
        if (!isNaN(key)) {
            // ✅ Save state before operation
            initialStructureRef.current = [...structureRef.current];

            runOperation(
                BinaryTree.deleteOp,
                { key },
                BinaryTree.deletePseudo,
                "delete"
            );
            setShowDeleteModal(false);
            setDeleteValue("");
        }
    };


    const search = () => setShowSearchModal(true);
    const handleSearchConfirm = () => {
        const key = Number(searchValue);
        if (!isNaN(key)) {
            initialStructureRef.current = [...structureRef.current];
            runOperation(
                BinaryTree.searchOp,
                { key },
                BinaryTree.searchPseudo,
                "search"
            );
            setShowSearchModal(false);
            setSearchValue("");
        }
    };


    const inorder = () => runOperation(
        BinaryTree.inorderOp,
        {},
        BinaryTree.inorderPseudo,
        "inorder"
    );


    const preorder = () => runOperation(
        BinaryTree.preorderOp,
        {},
        BinaryTree.preorderPseudo,
        "preorder"
    );


    const postorder = () => runOperation(
        BinaryTree.postorderOp,
        {},
        BinaryTree.postorderPseudo,
        "postorder"
    );


    const findMin = () => runOperation(
        BinaryTree.findMinOp,
        {},
        BinaryTree.findMinPseudo,
        "findMin"
    );


    const findMax = () => runOperation(
        BinaryTree.findMaxOp,
        {},
        BinaryTree.findMaxPseudo,
        "findMax"
    );


    const generate = () => {
        if (isReplayMode) return;

        const s = generateDS("binarytree", 7);
        setStructure(s);
        structureRef.current = s;
        initialStructureRef.current = [...s]; // ✅ This is correct
        setExplanation("🆕 New binary tree generated");
    };


    const useInput = () => {
        if (isReplayMode) return;


        try {
            const s = parseCustomInput(input, "binarytree");
            setStructure(s);
            structureRef.current = s;
            initialStructureRef.current = [...s]; // ✅ FIXED: Update initial state
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
            {/* ===== INSERT MODAL ===== */}
            <Modal
                title="➕ Insert Node"
                isOpen={showInsertModal}
                onConfirm={handleInsertConfirm}
                onCancel={() => {
                    setShowInsertModal(false);
                    setInsertValue("");
                }}
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
                <div className="text-xs text-gray-400">Tree size: {structure.length}</div>
            </Modal>


            {/* ===== DELETE MODAL ===== */}
            <Modal
                title="🗑️ Delete Node"
                isOpen={showDeleteModal}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setDeleteValue("");
                }}
            >
                <input
                    type="number"
                    value={deleteValue}
                    onChange={(e) => setDeleteValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Value to delete"
                />
                <div className="text-xs text-gray-400">Tree size: {structure.length}</div>
            </Modal>


            {/* ===== SEARCH MODAL ===== */}
            <Modal
                title="🔍 Search Node"
                isOpen={showSearchModal}
                onConfirm={handleSearchConfirm}
                onCancel={() => {
                    setShowSearchModal(false);
                    setSearchValue("");
                }}
            >
                <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Search value"
                    autoFocus
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
                            🌲 {meta.name}
                        </h1>
                        <p className="text-gray-300 mb-6 leading-relaxed">{meta.description}</p>
                        <ComplexityPanel data={meta.complexity} />
                    </div>


                    <div className="bg-black/40 rounded-2xl p-8 backdrop-blur border border-white/10">
                        <BinaryTreeCanvas structure={structure} colors={colors} />
                    </div>


                    <ExplanationPanel text={explanation} />
                </div>


                <div className="lg:col-span-2 flex flex-col gap-6">
                    <BinaryTreeControlPanel
                        insert={insert}
                        deleteNode={deleteNode}
                        search={search}
                        inorder={inorder}
                        preorder={preorder}
                        postorder={postorder}
                        findMin={findMin}
                        findMax={findMax}
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
