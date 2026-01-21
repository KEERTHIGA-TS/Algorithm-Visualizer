// src/components/Canvas/Data Structures/BinaryHeapCanvas.jsx
import { useEffect, useRef } from "react";

export default function BinaryHeapCanvas({ structure, colors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (!structure.length) return;

    const NODE_RADIUS = 22;
    const LEVEL_HEIGHT = 90;

    const getColor = (key) => {
      const map = {
        active: "#10b981",
        visited: "#f59e0b",
        current: "#ef4444",
        default: "#475569",
      };
      return map[key] || map.default;
    };

    /* ================= DRAW ================= */
    const drawNode = (idx, x, y, gap) => {
      if (idx >= structure.length) return;

      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;

      // LEFT CHILD
      if (left < structure.length) {
        const childX = x - gap;
        const childY = y + LEVEL_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(x, y + NODE_RADIUS);
        ctx.lineTo(childX, childY - NODE_RADIUS);
        ctx.stroke();
        drawNode(left, childX, childY, gap / 1.8);
      }

      // RIGHT CHILD
      if (right < structure.length) {
        const childX = x + gap;
        const childY = y + LEVEL_HEIGHT;
        ctx.beginPath();
        ctx.moveTo(x, y + NODE_RADIUS);
        ctx.lineTo(childX, childY - NODE_RADIUS);
        ctx.stroke();
        drawNode(right, childX, childY, gap / 1.8);
      }

      // NODE
      ctx.fillStyle = getColor(colors[idx]);
      ctx.beginPath();
      ctx.arc(x, y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // VALUE
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const value =
        typeof structure[idx] === "object"
          ? structure[idx].value
          : structure[idx];

      ctx.fillText(value, x, y);

      // INDEX
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px monospace";
      ctx.fillText(idx, x, y + NODE_RADIUS + 12);
    };

    /* ================= START ================= */
    drawNode(0, rect.width / 2, 60, rect.width / 4);
  }, [structure, colors]);

  return (
    <div className="w-full h-[520px] bg-black/20 rounded-xl border border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
