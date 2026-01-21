// src/components/Canvas/Data Structures/QueueCanvas.jsx
import { useEffect, useRef } from "react";

export default function QueueCanvas({ structure, colors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas dimensions
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "rgba(30, 41, 59, 0.95)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const count = structure.length || 1;
    const nodeSize = Math.min(55, rect.width / (count * 1.5));
    const spacing = Math.min(85, rect.width / (count + 2));

    const getColor = (key) => {
      const map = {
        active: "#10b981",
        visited: "#f59e0b",
        current: "#ef4444",
        default: "#4b5563",
      };
      return map[key] || map.default;
    };

    ctx.shadowColor = "#ffffff20";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const clearShadows = (fn) => {
      const oldShadow = ctx.shadowBlur;
      ctx.shadowBlur = 0;
      fn();
      ctx.shadowBlur = oldShadow;
    };

    // Render queue elements (same as linked list)
    structure.forEach((node, i) => {
      const x = centerX + (i - count / 2) * spacing;
      const y = centerY;

      // Node box (square like linked list)
      ctx.fillStyle = getColor(colors[i]);
      ctx.beginPath();
      ctx.roundRect(
        x - nodeSize / 2,
        y - nodeSize / 2,
        nodeSize,
        nodeSize,
        12
      );
      ctx.fill();

      // Value
      ctx.fillStyle = "white";
      ctx.font = `bold ${Math.max(18, nodeSize / 3)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.value, x, y);

      // Arrow to next node
      if (i < structure.length - 1) {
        clearShadows(() => {
          ctx.strokeStyle = "#9ca3af";
          ctx.lineWidth = 5;
          ctx.lineCap = "round";
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(x + nodeSize / 2, y);
          ctx.lineTo(x + nodeSize / 2 + spacing / 2 - 25, y);
          ctx.lineTo(x + nodeSize / 2 + spacing / 2 - 15, y - 10);
          ctx.lineTo(x + nodeSize / 2 + spacing / 2 - 15, y + 10);
          ctx.lineTo(x + nodeSize / 2 + spacing / 2 - 25, y);
          ctx.stroke();
        });
      }
    });

    // FRONT label (green)
    if (structure.length > 0) {
      const frontX = centerX + (0 - count / 2) * spacing;
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FRONT", frontX, centerY - nodeSize - 10);
    }

    // REAR label (red)
    if (structure.length > 0) {
      const rearX = centerX + (structure.length - 1 - count / 2) * spacing;
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("REAR", rearX, centerY + nodeSize + 20);
    }
  }, [structure, colors]);

  return (
    <div className="w-full h-[400px] bg-black/20 rounded-xl border border-white/10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}

/* Polyfill */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}