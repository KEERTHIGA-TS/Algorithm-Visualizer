// pages/Category.jsx
import { useParams, Link } from "react-router-dom";

const sortingAlgos = [
  { id: "bubble", name: "Bubble Sort", time: "O(n²)", path: "visualizer" },
  { id: "selection", name: "Selection Sort", time: "O(n²)", path: "visualizer" },
  { id: "insertion", name: "Insertion Sort", time: "O(n²)", path: "visualizer" },
  { id: "merge", name: "Merge Sort", time: "O(n log n)", path: "visualizer" },
  { id: "quick", name: "Quick Sort", time: "O(n log n)", path: "visualizer" },
];

const graphAlgos = [
  { id: "bfs", name: "Breadth-First Search", time: "O(V+E)", path: "graphs" },
  { id: "dfs", name: "Depth-First Search", time: "O(V+E)", path: "graphs" },
  { id: "dijkstra", name: "Dijkstra's Algorithm", time: "O((V+E)logV)", path: "graphs" },
];

const dataStructureAlgos = [
  { id: "linkedlist", name: "Linked List", time: "O(1) insert/delete", path: "structures" },
  { id: "stack", name: "Stack", time: "O(1) push/pop", path: "structures" },
  { id: "queue", name: "Queue", time: "O(1) enqueue/dequeue", path: "structures" },
  { id: "binarytree", name: "Binary Tree", time: "O(log n) search", path: "structures" },
  { id: "binaryheap", name: "Binary Heap", time: "O(log n) insert", path: "structures" },
];

export default function Category() {
  const { type } = useParams(); // 👈 Get "sorting" or "graphs" or "structures"

  const categoryData = type === "graphs" ? graphAlgos : 
                      type === "structures" ? dataStructureAlgos : 
                      sortingAlgos;
  
  const title = type === "graphs" ? "Graph Algorithms" : 
                type === "structures" ? "Data Structures" : 
                "Sorting Algorithms";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 text-lg font-medium"
      >
        ← Back to Home
      </Link>

      <h2 className="text-3xl font-bold mb-6">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryData.map((algo) => (
          <Link
            key={algo.id}
            to={`/${algo.path}/${algo.id}`}  // 👈 Dynamic path
            className="group bg-black/40 p-6 rounded-xl hover:ring-2 hover:ring-purple-500/50 transition-all hover:bg-black/60 border border-transparent hover:border-purple-500/30"
          >
            <h3 className="text-xl font-semibold group-hover:text-purple-400 transition">
              {algo.name}
            </h3>
            <p className="text-gray-400 mt-2">Time Complexity: {algo.time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
