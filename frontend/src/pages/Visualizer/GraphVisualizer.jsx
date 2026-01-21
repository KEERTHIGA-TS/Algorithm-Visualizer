// ============================================
// frontend/src/pages/Visualizer/graphs/GraphVisualizer.jsx - FULL REPLAY SUPPORT
// ============================================
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import GraphCanvas from "../../components/Canvas/GraphCanvas";
import GraphControlPanel from "../../components/ControlPanel/GraphControlPanel";
import PseudocodePanel from "../../components/PseudocodePanel";
import ComplexityPanel from "../../components/ComplexityPanel";
import ExplanationPanel from "../../components/ExplanationPanel";
import { generateGraph } from "../../utils/generateGraph";

import { bfs, bfsPseudo } from "../../algorithms/graphs/bfs";
import { dfs, dfsPseudo } from "../../algorithms/graphs/dfs";
import { dijkstra, dijkstraPseudo } from "../../algorithms/graphs/dijkstra";
import { useHistoryStore } from "../../store/historyStore";

export default function GraphVisualizer() {
  const { algo } = useParams();
  const [searchParams] = useSearchParams();
  const replayId = searchParams.get('replay');

  const { saveHistory, getHistoryForReplay } = useHistoryStore();

  /* ---------------- STATE ---------------- */
  const [graph, setGraph] = useState(generateGraph(6, 0.3));
  const [startNode, setStartNode] = useState(0);
  const [colors, setColors] = useState({});
  const [speed, setSpeed] = useState(50);
  const [nodes, setNodes] = useState(6);
  const [input, setInput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [currentLine, setCurrentLine] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [isReplayMode, setIsReplayMode] = useState(false); // ✅ NEW

  /* ---------------- REFS ---------------- */
  const graphRef = useRef(graph);
  const initialGraphRef = useRef(graph);
  const speedRef = useRef(50); // ✅ FIXED: Number literal
  const pauseRef = useRef(false);
  const shouldStopRef = useRef(false);
  const isRunningRef = useRef(false);
  const stepCountRef = useRef(0);
  const hasAutoStartedRef = useRef(false);

  /* ---------------- META ---------------- */
  const GRAPH_ALGOS = {
    bfs: { sort: bfs, pseudo: bfsPseudo },
    dfs: { sort: dfs, pseudo: dfsPseudo },
    dijkstra: { sort: dijkstra, pseudo: dijkstraPseudo },
  };

  const ALGO_META = {
    bfs: {
      name: "Breadth-First Search",
      description: "Explores graph level-by-level using a queue.",
      complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" }
    },
    dfs: {
      name: "Depth-First Search",
      description: "Explores as far as possible along each branch using recursion.",
      complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" }
    },
    dijkstra: {
      name: "Dijkstra's Algorithm",
      description: "Finds shortest paths from source to all vertices.",
      complexity: { best: "O((V+E)logV)", average: "O((V+E)logV)", worst: "O((V+E)logV)", space: "O(V)" }
    },
  };

  const currentAlgo = GRAPH_ALGOS[algo] || GRAPH_ALGOS.bfs;
  const currentMeta = ALGO_META[algo] || ALGO_META.bfs;

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { graphRef.current = graph; }, [graph]);

  // ✅ Load replay OR generate graph
  useEffect(() => {
    if (replayId) {
      console.log("🎬 Loading graph replay:", replayId);
      loadReplay(replayId);
    } else {
      generateNewGraph();
    }
  }, [replayId]);

  // ✅ Auto-start replay
  useEffect(() => {
    if (isReplayMode && Object.keys(graph).length > 0 && !isRunningRef.current) {
      console.log("🚀 Auto-starting graph replay...");
      const timer = setTimeout(() => {
        if (!isRunningRef.current) {
          start();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isReplayMode, graph]);

  // ✅ Reset replay flag
  useEffect(() => {
    if (!isReplayMode) {
      hasAutoStartedRef.current = false;
    }
  }, [isReplayMode]);

  useEffect(() => {
    if (!isRunningRef.current && !isReplayMode) {
      generateNewGraph();
    }
  }, [nodes]);

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

  // ✅ REPLAY LOADER
  const loadReplay = async (id) => {
    console.log("📦 Loading graph replay:", id);

    try {
      const history = await getHistoryForReplay(id);

      if (!history || !history.replayData) {
        console.error("❌ No replay data found");
        setExplanation("Failed to load replay");
        return;
      }

      const replaySpeed = history.speed ?? 50;
      const { initialInput, operationParams } = history.replayData;

      console.log("✅ Graph replay loaded:", "Speed:", replaySpeed);

      // ---------- STATE ----------
      setGraph(initialInput);
      setSpeed(replaySpeed);
      setStartNode(operationParams?.startNode ?? 0);
      setNodes(Object.keys(initialInput).length);

      // ---------- REFS ----------
      speedRef.current = replaySpeed;
      graphRef.current = initialInput;
      initialGraphRef.current = JSON.parse(JSON.stringify(initialInput));

      // ---------- UI ----------
      setInput(JSON.stringify(initialInput, null, 2));
      setExplanation(`🔄 Replay loaded: ${history.algorithm.name} (${replaySpeed}ms) - Starting in 1.5s...`);
      setIsReplayMode(true);

    } catch (err) {
      console.error("❌ Replay error:", err);
      setExplanation("Error loading replay");
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const incrementStep = useCallback(() => {
    stepCountRef.current += 1;
  }, []);

  const generateNewGraph = useCallback(async () => {
    await stopAndReset(() => {
      const newGraph = generateGraph(nodes, 0.3);
      setGraph(newGraph);
      graphRef.current = newGraph;
      initialGraphRef.current = JSON.parse(JSON.stringify(newGraph));
      setStartNode(0);
      setInput(JSON.stringify(newGraph, null, 2));
      setExplanation("🆕 New weighted graph generated!");
      setIsReplayMode(false);
      hasAutoStartedRef.current = false;
    });
  }, [nodes, resetUI]);

  const restart = useCallback(async () => {
    await stopAndReset(() => {
      const resetGraph = JSON.parse(JSON.stringify(initialGraphRef.current));
      setGraph(resetGraph);
      graphRef.current = resetGraph;
      setStartNode(0);
      setExplanation("Restarted to original graph");
      hasAutoStartedRef.current = false;
    });
  }, [resetUI]);

  const togglePause = useCallback(() => {
    if (!isRunningRef.current) return;
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
  }, []);

  const start = useCallback(async () => {
    if (isRunningRef.current || Object.keys(graph).length === 0) return;

    isRunningRef.current = true;
    shouldStopRef.current = false;
    pauseRef.current = false;
    setIsPaused(false);
    stepCountRef.current = 0;

    setColors({});
    setCurrentLine(-1);
    setExplanation(`🚀 Starting ${currentMeta.name} from node ${startNode}`);

    const startTime = Date.now();

    try {
      await currentAlgo.sort({
        graph: graphRef.current,
        startNode,
        setColors,
        setExplanation,
        speedRef: speedRef.current,
        pauseRef,
        shouldStopRef,
        setCurrentLine,
        incrementStep,
      });

      const duration = Date.now() - startTime;

      console.log("📊 Saving graph:", {
        algorithm: currentMeta.name,
        steps: stepCountRef.current,
        duration,
        speed: speed
      });

      // ✅ Save ONLY if not replay
      if (!isReplayMode && saveHistory) {
        await saveHistory({
          category: "graphs",
          algorithm: { name: currentMeta.name, key: algo },
          steps: stepCountRef.current,
          duration,
          arraySize: Object.keys(graphRef.current).length,
          speed: speed, // ✅ FIXED: Use state
          replayData: {
            initialInput: JSON.parse(JSON.stringify(graphRef.current)),
            operationParams: { startNode },
            finalOutput: JSON.parse(JSON.stringify(graphRef.current)),
            speed: speed // ✅ FIXED: Use state
          }
        });
      }

      setExplanation(
        isReplayMode
          ? `🎉 Graph replay completed! ${currentMeta.name}`
          : `${currentMeta.name} completed! 🎉`
      );
    } catch (err) {
      console.error("Graph algo error:", err);
    } finally {
      isRunningRef.current = false;
    }
  }, [currentAlgo.sort, startNode, currentMeta.name, algo, saveHistory, incrementStep, isReplayMode, speed, graph]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-6 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* INFO PANEL */}
          <div className="bg-black/40 rounded-2xl p-6 backdrop-blur border border-white/10">
            {isReplayMode && (
              <div className="mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl flex items-center justify-center">
                <span className="text-purple-300 font-semibold">🔄 Replay Mode - Auto-starting...</span>
              </div>
            )}
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {currentMeta.name}
            </h1>
            <p className="text-gray-300 mb-6">{currentMeta.description}</p>
            <ComplexityPanel data={currentMeta.complexity} />
          </div>

          {/* VISUALIZATION */}
          <div className="bg-black/40 rounded-2xl p-8 backdrop-blur border border-white/10 flex flex-col gap-6">
            <GraphCanvas
              graph={graph}
              colors={colors}
              startNode={startNode}
              nodes={nodes}
              isRunning={isRunningRef.current}
            />
            <ExplanationPanel text={explanation} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GraphControlPanel
            start={start}
            restart={restart}  // ✅ You have this
            generate={generateNewGraph}
            togglePause={togglePause}
            nodes={nodes}
            setNodes={setNodes}
            startNode={startNode}
            setStartNode={setStartNode}
            speed={speed}
            setSpeed={setSpeed}
            isRunning={isRunningRef.current}
            isPaused={isPaused}
            algoMeta={currentMeta}
            isReplayMode={isReplayMode}  // ✅ ADD THIS LINE
          />

          <PseudocodePanel code={currentAlgo.pseudo} currentLine={currentLine} />
        </div>
      </div>
    </div>
  );
}
