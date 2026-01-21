// ============================================
// frontend/src/pages/Visualizer/Visualizer.jsx - AUTO REPLAY FIX
// ============================================
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Bars from "../../components/Canvas/Bars";
import ControlPanel from "../../components/ControlPanel/ControlPanel";
import PseudocodePanel from "../../components/PseudocodePanel";
import ComplexityPanel from "../../components/ComplexityPanel";
import ExplanationPanel from "../../components/ExplanationPanel";

import { generateArray } from "../../utils/generateArray";
import { useHistoryStore } from "../../store/historyStore";

import { bubbleSort, bubbleSortPseudo } from "../../algorithms/sorting/bubbleSort";
import { selectionSort, selectionSortPseudo } from "../../algorithms/sorting/selectionSort";
import { insertionSort, insertionSortPseudo } from "../../algorithms/sorting/insertionSort";
import { mergeSort, mergeSortPseudo } from "../../algorithms/sorting/mergeSort";
import { quickSort, quickSortPseudo } from "../../algorithms/sorting/quickSort";

export default function Visualizer() {
    const { algo } = useParams();
    const [searchParams] = useSearchParams();
    const replayId = searchParams.get('replay');

    const { saveHistory, getHistoryForReplay } = useHistoryStore();

    /* ---------------- STATE ---------------- */
    const [array, setArray] = useState([]);
    const [colors, setColors] = useState({});
    const [speed, setSpeed] = useState(50);
    const [size, setSize] = useState(20);
    const [input, setInput] = useState("");
    const [explanation, setExplanation] = useState("");
    const [currentLine, setCurrentLine] = useState(-1);
    const [isPaused, setIsPaused] = useState(false);
    const [isReplayMode, setIsReplayMode] = useState(false); // ✅ NEW

    /* ---------------- REFS ---------------- */
    const arrayRef = useRef([]);
    const initialArrayRef = useRef([]);
    const originalArrayRef = useRef([]);
    const speedRef = useRef(50);
    const pauseRef = useRef(false);
    const shouldStopRef = useRef(false);
    const isRunningRef = useRef(false);
    const stepCountRef = useRef(0);
    const hasAutoStartedRef = useRef(false); // ✅ NEW: Prevent double-start

    /* ---------------- META ---------------- */
    const SORTING_ALGOS = {
        bubble: { sort: bubbleSort, pseudo: bubbleSortPseudo },
        selection: { sort: selectionSort, pseudo: selectionSortPseudo },
        insertion: { sort: insertionSort, pseudo: insertionSortPseudo },
        merge: { sort: mergeSort, pseudo: mergeSortPseudo },
        quick: { sort: quickSort, pseudo: quickSortPseudo },
    };

    const ALGO_META = {
        bubble: {
            name: "Bubble Sort",
            description: "Repeatedly compares adjacent elements and swaps them if they are in the wrong order.",
            complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
        },
        selection: {
            name: "Selection Sort",
            description: "Selects the smallest element from the unsorted part and places it at the beginning.",
            complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
        },
        insertion: {
            name: "Insertion Sort",
            description: "Builds the sorted array one element at a time by inserting elements into their correct position.",
            complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
        },
        merge: {
            name: "Merge Sort",
            description: "Divides the array into halves, sorts them recursively, and merges them back together.",
            complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
        },
        quick: {
            name: "Quick Sort",
            description: "Picks a pivot element and partitions the array around the pivot.",
            complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
        },
    };

    const currentAlgo = SORTING_ALGOS[algo] || SORTING_ALGOS.bubble;
    const currentMeta = ALGO_META[algo] || ALGO_META.bubble;

    /* ---------------- EFFECTS - FIXED AUTO-REPLAY ---------------- */
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        arrayRef.current = array;
    }, [array]);

    // ✅ Load replay OR generate array
    useEffect(() => {
        if (replayId) {
            console.log("🎬 Loading replay:", replayId);
            loadReplay(replayId);
        } else {
            generateNewArray();
        }
    }, [replayId]);

    // ✅ Auto-start IMMEDIATELY when replay loads
    useEffect(() => {
        if (isReplayMode && array.length > 0 && !isRunningRef.current) {
            console.log("🚀 Auto-starting replay...");

            const timer = setTimeout(() => {
                if (!isRunningRef.current) {
                    start();
                }
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isReplayMode, array.length]);

    // ✅ Reset flag when mode changes
    useEffect(() => {
        if (!isReplayMode) {
            hasAutoStartedRef.current = false;
        }
    }, [isReplayMode]);

    /* ---------------- HELPERS ---------------- */
    const resetUI = useCallback(() => {
        setColors({});
        setExplanation("");
        setCurrentLine(-1);
        pauseRef.current = false;
        setIsPaused(false);
        stepCountRef.current = 0;
    }, []);

    const stopAndReset = async (callback) => {
        if (!isRunningRef.current) {
            callback();
            resetUI();
            return;
        }

        shouldStopRef.current = true;
        pauseRef.current = false;
        setIsPaused(false);

        await new Promise((r) => setTimeout(r, 50));

        callback();
        resetUI();

        shouldStopRef.current = false;
        isRunningRef.current = false;
    };

    // ✅ FIXED: Load replay and set flag
    const loadReplay = async (id) => {
        console.log("📦 Loading replay:", id);

        try {
            const history = await getHistoryForReplay(id);

            if (!history || !history.replayData) {
                console.error("❌ No replay data found");
                setExplanation("Failed to load replay");
                return;
            }

            const replaySpeed = history.speed ?? 50;
            const { initialInput } = history.replayData;

            console.log(
                "✅ Replay data loaded:",
                initialInput,
                "Speed:",
                replaySpeed
            );

            // ---------- STATE ----------
            setArray(initialInput);
            setSpeed(replaySpeed);

            // ---------- REFS (CRITICAL) ----------
            speedRef.current = replaySpeed;
            arrayRef.current = initialInput;
            initialArrayRef.current = [...initialInput];
            originalArrayRef.current = [...initialInput];

            // ---------- UI ----------
            setInput(initialInput.join(", "));
            setExplanation(
                `🔄 Replay loaded: ${history.algorithm.name} (${replaySpeed}ms speed) - Starting in 1.5s...`
            );

            setIsReplayMode(true);

        } catch (err) {
            console.error("❌ Error while loading replay:", err);
            setExplanation("Error loading replay");
        }
    };


    /* ---------------- ACTIONS ---------------- */
    const generateNewArray = useCallback(async () => {
        await stopAndReset(() => {
            const newArr = generateArray(size);
            setArray(newArr);
            arrayRef.current = newArr;
            initialArrayRef.current = [...newArr];
            originalArrayRef.current = [...newArr];
            setInput(newArr.join(", "));
            setExplanation("New random array generated");
            setIsReplayMode(false);
            hasAutoStartedRef.current = false;
        });
    }, [size, resetUI]);

    const restart = useCallback(async () => {
        await stopAndReset(() => {
            const resetArr = [...initialArrayRef.current];
            setArray(resetArr);
            arrayRef.current = resetArr;
            originalArrayRef.current = resetArr;
            setExplanation("Restarted to original array");
            hasAutoStartedRef.current = false;
        });
    }, [resetUI]);

    const togglePause = useCallback(() => {
        if (!isRunningRef.current) return;
        pauseRef.current = !pauseRef.current;
        setIsPaused(pauseRef.current);
    }, []);

    const useInput = useCallback(async () => {
        if (isRunningRef.current) return;

        const nums = input
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));

        if (nums.length < 2 || nums.length > 50) {
            alert("Enter 2-50 valid numbers separated by commas");
            return;
        }

        await stopAndReset(() => {
            setArray(nums);
            arrayRef.current = nums;
            initialArrayRef.current = [...nums];
            originalArrayRef.current = [...nums];
            setInput(nums.join(", "));
            setExplanation("Custom input applied successfully");
            setIsReplayMode(false);
            hasAutoStartedRef.current = false;
        });
    }, [input, resetUI]);

    const incrementStep = useCallback(() => {
        stepCountRef.current += 1;
    }, []);

    const start = useCallback(async () => {
        if (isRunningRef.current || array.length < 2) return;

        isRunningRef.current = true;
        shouldStopRef.current = false;
        pauseRef.current = false;
        setIsPaused(false);
        stepCountRef.current = 0;

        setColors({});
        setCurrentLine(-1);
        setExplanation(`🚀 Starting ${currentMeta.name}`);

        const startTime = Date.now();

        try {
            await currentAlgo.sort({
                array: arrayRef.current,
                setArray,
                setColors,
                setExplanation,
                speedRef: speedRef.current,
                pauseRef,
                shouldStopRef,
                setCurrentLine,
                initialArray: initialArrayRef.current,
                incrementStep,
            });

            const duration = Date.now() - startTime;

            console.log("📊 Saving:", {
                algorithm: currentMeta.name,
                steps: stepCountRef.current,
                duration,
                speed: speed  // ✅ SPEED LOGGED
            });

            // ✅ Only save if not in replay mode
            if (!isReplayMode) {
                await saveHistory({
                    category: "sorting",
                    algorithm: {
                        name: currentMeta.name,
                        key: algo,
                    },
                    steps: stepCountRef.current,
                    duration,
                    arraySize: initialArrayRef.current.length,
                    speed: speed,
                    replayData: {  // ✅ CORRECT SYNTAX
                        initialInput: [...initialArrayRef.current],
                        operationParams: null,
                        finalOutput: [...arrayRef.current],
                        speed: speed,
                    }
                });
            }

            setExplanation(
                isReplayMode
                    ? `🎉 Replay completed! ${currentMeta.name}`
                    : `${currentMeta.name} completed! 🎉`
            );
        } catch (err) {
            console.error("Sort error:", err);
        } finally {
            isRunningRef.current = false;
        }
    }, [currentAlgo.sort, array.length, currentMeta.name, algo, saveHistory, incrementStep, isReplayMode, speed]); // ✅ ADD speed dep


    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-6 py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT SIDE */}
                <div className="lg:col-span-3 flex flex-col gap-4">

                    {/* INFO PANEL */}
                    <div className="bg-black/40 rounded-2xl p-6 backdrop-blur border border-white/10">
                        {/* ✅ Show replay indicator */}
                        {isReplayMode && (
                            <div className="mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl flex items-center justify-center">
                                <span className="text-purple-300 font-semibold">
                                    🔄 Replay Mode - Auto-starting...
                                </span>
                            </div>
                        )}

                        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {currentMeta.name}
                        </h1>
                        <p className="text-gray-300 mb-6 leading-relaxed">{currentMeta.description}</p>
                        <ComplexityPanel data={currentMeta.complexity} />
                    </div>

                    {/* VISUALIZATION */}
                    <div className="bg-black/40 rounded-2xl p-8 backdrop-blur border border-white/10 flex flex-col gap-6">
                        <Bars array={array} colors={colors} />
                        <ExplanationPanel text={explanation} />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <ControlPanel
                        start={start}
                        restart={restart}
                        generate={generateNewArray}
                        togglePause={togglePause}
                        isPaused={isPaused}
                        isRunning={isRunningRef.current}
                        speed={speed}
                        setSpeed={setSpeed}
                        size={size}
                        setSize={setSize}
                        input={input}
                        setInput={setInput}
                        useInput={useInput}
                        isReplayMode={isReplayMode}  // ✅ ADD THIS LINE
                    />

                    <PseudocodePanel
                        code={currentAlgo.pseudo}
                        currentLine={currentLine}
                    />
                </div>

            </div>
        </div>
    );
}
