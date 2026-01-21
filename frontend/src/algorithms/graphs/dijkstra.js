// 

import { sleep } from "../../utils/sleep";

export const dijkstraPseudo = [
  "1. dist[start]=0, others ∞",
  "2. While unvisited:",
  "3.   Select u = min dist",
  "4.   Mark u GREEN",
  "5.   For neighbors v:",
  "6.     Relax: dist[v] = min(dist[v], dist[u]+w)"
];

export async function dijkstra({ graph, startNode, setColors, setExplanation, speedRef, pauseRef, shouldStopRef, setCurrentLine, incrementStep, }) {
  const n = graph.length;
  const distances = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  distances[startNode] = 0;

  incrementStep();

  setCurrentLine(1);
  setColors(prev => ({ ...prev, [startNode]: "sorted" }));
  setExplanation("dist[start]=0");
  await sleep(speedRef, pauseRef, shouldStopRef);

  while (true && !shouldStopRef.current) {
    setCurrentLine(2);
    
    let u = -1, minDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited[i] && distances[i] < minDist) {
        minDist = distances[i];
        u = i;
      }
    }
    if (u === -1) break;

    visited[u] = true;

    incrementStep();

    setCurrentLine(4);
    setColors(prev => ({ ...prev, [u]: "sorted" }));
    setExplanation(`Select ${u} (dist: ${minDist})`);
    await sleep(speedRef, pauseRef, shouldStopRef);

    setCurrentLine(5);
    for (let v = 0; v < n; v++) {
      if (shouldStopRef.current) break;
      if (graph[u][v] > 0 && !visited[v]) {
        setCurrentLine(6);
        const newDist = distances[u] + graph[u][v];
        if (newDist < distances[v]) {
          distances[v] = newDist;

          incrementStep();

          setColors(prev => ({ ...prev, [v]: "compare" }));
          setExplanation(`Update dist[${v}] = ${newDist}`);
          await sleep(speedRef / 2, pauseRef, shouldStopRef);
        }
      }
    }
  }
  setExplanation("Dijkstra complete! 🎉");
}
