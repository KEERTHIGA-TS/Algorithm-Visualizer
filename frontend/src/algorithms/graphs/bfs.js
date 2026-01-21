// import { sleep } from "../../utils/sleep";

// export const bfsPseudo = [
//   "1. Queue start, mark GREEN",
//   "2. While queue:",
//   "3.   Dequeue u", 
//   "4.   For neighbors v:",
//   "5.     If unvisited:",
//   "6.       Mark GREEN, enqueue"
// ];

// export async function bfs({ graph, startNode, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine }) {
//   const n = graph.length;
//   const visited = Array(n).fill(false);
//   const queue = [];

//   // Start node
//   setCurrentLine(1);
//   visited[startNode] = true;
//   queue.push(startNode);
//   setColors(prev => ({ ...prev, [startNode]: "sorted" }));
//   setExplanation("Enqueue start GREEN");
//   await sleep(speedRef, pauseRef, shouldStopRef);

//   while (queue.length > 0 && !shouldStopRef.current) {
//     const u = queue.shift();
//     setCurrentLine(3);
//     setExplanation(`Dequeue ${u}`);

//     for (let v = 0; v < n; v++) {
//       if (shouldStopRef.current) break;
      
//       if (graph[u][v] > 0 && !visited[v]) {
//         setCurrentLine(5);
//         visited[v] = true;
//         queue.push(v);
//         setColors(prev => ({ ...prev, [v]: "sorted" }));
//         setCurrentLine(6);
//         setExplanation(`Enqueue ${v} GREEN`);
//         await sleep(speedRef, pauseRef, shouldStopRef);
//       }
//     }
//   }
//   setExplanation("BFS complete! 🎉");
// }
import { sleep } from "../../utils/sleep";

export const bfsPseudo = [
  "1. Queue start, mark GREEN",
  "2. While queue:",
  "3.   Dequeue u", 
  "4.   For neighbors v:",
  "5.     If unvisited:",
  "6.       Mark GREEN, enqueue"
];

export async function bfs({ graph, startNode, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep, }) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const queue = [];

  setCurrentLine(1);
  visited[startNode] = true;
  queue.push(startNode);

  incrementStep();

  setColors(prev => ({ ...prev, [startNode]: "sorted" }));
  setExplanation("Enqueue start GREEN");
  await sleep(speedRef, pauseRef, shouldStopRef);

  while (queue.length > 0 && !shouldStopRef.current) {
    const u = queue.shift();

    incrementStep();

    setCurrentLine(3);
    setExplanation(`Dequeue ${u}`);

    for (let v = 0; v < n; v++) {
      if (shouldStopRef.current) break;
      
      if (graph[u][v] > 0 && !visited[v]) {
        setCurrentLine(5);
        visited[v] = true;
        queue.push(v);

        incrementStep();

        setColors(prev => ({ ...prev, [v]: "sorted" }));
        setCurrentLine(6);
        setExplanation(`Enqueue ${v} GREEN`);
        await sleep(speedRef, pauseRef, shouldStopRef);
      }
    }
  }
  setExplanation("BFS complete! 🎉");
}
