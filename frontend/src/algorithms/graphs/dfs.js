// import { sleep } from "../../utils/sleep";

// export const dfsPseudo = [
//   "1. Visit node u",
//   "2. Mark u GREEN", 
//   "3. For each neighbor v",
//   "4.   If not visited",
//   "5.     DFS(v)"
// ];

// export async function dfs({ graph, startNode, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine }) {
//   const n = graph.length;
//   const visited = Array(n).fill(false);

//   async function dfsVisit(u) {
//     if (shouldStopRef.current) return;

//     visited[u] = true;
//     setCurrentLine(2);
//     setColors(prev => ({ ...prev, [u]: "sorted" }));
//     setExplanation(`Visit node ${u}`);
//     await sleep(speedRef, pauseRef, shouldStopRef);

//     for (let v = 0; v < n; v++) {
//       if (shouldStopRef.current) return;
      
//       if (graph[u][v] > 0 && !visited[v]) {
//         setCurrentLine(4);
//         setColors(prev => ({ ...prev, [u]: "sorted", [v]: "compare" }));
//         setExplanation(`Going deeper ${u} → ${v}`);
//         await sleep(speedRef.current / 2, pauseRef, shouldStopRef);
//         await dfsVisit(v);
        
//         setExplanation(`Back from ${v}`);
//         await sleep(speedRef.current / 3, pauseRef, shouldStopRef);
//       }
//     }
//   }

//   await dfsVisit(startNode);
//   setExplanation("DFS complete! 🎉");
// }

import { sleep } from "../../utils/sleep";

export const dfsPseudo = [
  "1. Visit node u",
  "2. Mark u GREEN", 
  "3. For each neighbor v",
  "4.   If not visited",
  "5.     DFS(v)"
];

export async function dfs({ graph, startNode, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep, }) {
  const n = graph.length;
  const visited = Array(n).fill(false);

  async function dfsVisit(u) {
    if (shouldStopRef.current) return;

    visited[u] = true;

    incrementStep();

    setCurrentLine(2);
    setColors(prev => ({ ...prev, [u]: "sorted" }));
    setExplanation(`Visit node ${u}`);
    await sleep(speedRef, pauseRef, shouldStopRef);

    for (let v = 0; v < n; v++) {
      if (shouldStopRef.current) return;
      
      if (graph[u][v] > 0 && !visited[v]) {
        setCurrentLine(4);
        setColors(prev => ({ ...prev, [u]: "sorted", [v]: "compare" }));
        setExplanation(`Going deeper ${u} → ${v}`);
        await sleep(speedRef / 2, pauseRef, shouldStopRef);

        incrementStep();

        await dfsVisit(v);
        
        setExplanation(`Back from ${v}`);
        await sleep(speedRef / 3, pauseRef, shouldStopRef);
      }
    }
  }

  await dfsVisit(startNode);
  setExplanation("DFS complete! 🎉");
}
