// src/components/Canvas/GraphCanvas.jsx - RESPONSIVE VERSION
import { useEffect, useRef, useState } from 'react';

export default function GraphCanvas({ graph, colors, startNode, nodes, isRunning }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // ✅ Responsive canvas sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Maintain aspect ratio (3:2)
        const height = Math.max(300, Math.min(width * 0.67, 500));
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle both adjacency list (object) and matrix formats
  const graphNodes = Array.isArray(graph) 
    ? graph.length 
    : Object.keys(graph).length;

  const n = nodes || graphNodes;
  
  // ✅ Responsive sizing based on container
  const baseSize = Math.min(dimensions.width, dimensions.height);
  const radius = Math.max(20, Math.min(35, baseSize / 15));
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  // ✅ Dynamic spacing based on number of nodes and screen size
  const spacing = Math.min(100, dimensions.width / (n + 1));
  const verticalSpread = Math.min(80, dimensions.height / 5);

  // ✅ Calculate node positions with better distribution
  const getNodePosition = (index) => {
    const totalNodes = n;
    
    if (totalNodes <= 3) {
      // Linear layout for few nodes
      const x = centerX + (index - (totalNodes - 1) / 2) * spacing;
      const y = centerY;
      return { x, y };
    } else if (totalNodes <= 6) {
      // Two-row layout
      const row = index % 2;
      const col = Math.floor(index / 2);
      const cols = Math.ceil(totalNodes / 2);
      const x = centerX + (col - (cols - 1) / 2) * spacing;
      const y = centerY + (row - 0.5) * verticalSpread;
      return { x, y };
    } else {
      // Circular layout for many nodes
      const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
      const orbitRadius = Math.min(
        dimensions.width * 0.35,
        dimensions.height * 0.35
      );
      const x = centerX + Math.cos(angle) * orbitRadius;
      const y = centerY + Math.sin(angle) * orbitRadius;
      return { x, y };
    }
  };

  // ✅ Render edges from adjacency list or matrix
  const renderEdges = () => {
    const edges = [];

    if (Array.isArray(graph)) {
      // Adjacency matrix
      graph.forEach((row, i) => {
        row.forEach((weight, j) => {
          if (i < j && weight > 0) {
            const pos1 = getNodePosition(i);
            const pos2 = getNodePosition(j);
            edges.push({ i, j, weight, ...pos1, x2: pos2.x, y2: pos2.y });
          }
        });
      });
    } else {
      // Adjacency list (object format)
      const processed = new Set();
      Object.entries(graph).forEach(([node, neighbors]) => {
        const i = parseInt(node);
        neighbors.forEach(({ node: neighbor, weight }) => {
          const j = parseInt(neighbor);
          const edgeKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
          
          if (!processed.has(edgeKey)) {
            processed.add(edgeKey);
            const pos1 = getNodePosition(i);
            const pos2 = getNodePosition(j);
            edges.push({ 
              i, 
              j, 
              weight, 
              x: pos1.x, 
              y: pos1.y, 
              x2: pos2.x, 
              y2: pos2.y 
            });
          }
        });
      });
    }

    return edges.map(({ i, j, weight, x, y, x2, y2 }) => (
      <g key={`${i}-${j}`}>
        <line
          x1={x} y1={y}
          x2={x2} y2={y2}
          stroke="#4b5563"
          strokeWidth={Math.max(2, radius / 15)}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <text
          x={(x + x2) / 2}
          y={(y + y2) / 2}
          fontSize={Math.max(10, radius / 2.5)}
          fill="#9ca3af"
          textAnchor="middle"
          dominantBaseline="middle"
          className="pointer-events-none select-none"
        >
          {weight}
        </text>
      </g>
    ));
  };

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-[3/2] max-h-[500px] relative border-2 border-blue-500/50 rounded-lg overflow-hidden bg-slate-950/50"
    >
      <svg 
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background Grid (optional visual enhancement) */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Edges */}
        {renderEdges()}

        {/* Nodes */}
        {Array.from({ length: n }, (_, i) => {
          const { x, y } = getNodePosition(i);
          const color = colors[i] || "default";
          const fillColor = {
            visiting: "#facc15",
            visited: "#22c55e",
            current: "#f97316",
            path: "#8b5cf6",
            default: "#60a5fa"
          }[color];

          return (
            <g key={i}>
              {/* Node circle */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={fillColor}
                stroke="#1e293b"
                strokeWidth={Math.max(2, radius / 10)}
                className="transition-all duration-300 drop-shadow-lg"
                style={{
                  filter: color !== 'default' ? 'brightness(1.1)' : 'none'
                }}
              />
              
              {/* Node label */}
              <text
                x={x}
                y={y + radius / 8}
                fontSize={Math.max(12, radius / 2)}
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
              >
                {i}
              </text>
              
              {/* Start node indicator */}
              {i === startNode && (
                <text
                  x={x}
                  y={y - radius - 10}
                  fontSize={Math.max(11, radius / 2.5)}
                  textAnchor="middle"
                  fill="#10b981"
                  fontWeight="bold"
                  className="pointer-events-none select-none animate-pulse"
                >
                  START
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Mobile helper text */}
      {isRunning && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-gray-300 sm:hidden">
          Tap to pause
        </div>
      )}
    </div>
  );
}