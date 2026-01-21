export function generateGraph(nodes = 6, edgeProbability = 0.3) {
  const graph = Array(nodes).fill().map(() => Array(nodes).fill(0));
  
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() < edgeProbability) {
        const weight = Math.floor(Math.random() * 9) + 1;
        graph[i][j] = weight;
        graph[j][i] = weight;
      }
    }
  }
  return graph;
}
