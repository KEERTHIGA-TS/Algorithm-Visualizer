// src/components/Canvas/DSVisualizerCanvas.jsx - CORRECTED STACK RENDERING
import { useEffect, useRef } from "react";

export default function DSVisualizerCanvas({ structure, colors, dsType, size, isRunning }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.fillStyle = "rgba(30, 41, 59, 0.95)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const count = structure.length || 1;
    const nodeSize = Math.min(55, rect.width / (count * 1.5));
    const spacing = Math.min(85, rect.width / (count + 2));

    const getColor = (colorKey) => {
      const colorsMap = {
        active: "#10b981",
        visited: "#f59e0b", 
        current: "#ef4444",
        default: "#4b5563"
      };
      return colorsMap[colorKey] || colorsMap.default;
    };

    ctx.shadowColor = "#ffffff20";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Clear shadows for lines
    const clearShadows = (fn) => {
      const oldShadow = ctx.shadowBlur;
      ctx.shadowBlur = 0;
      fn();
      ctx.shadowBlur = 20;
    };

    const renderLinkedList = () => {
      structure.forEach((node, i) => {
        const x = centerX + (i - count / 2) * spacing;
        const y = centerY;

        ctx.fillStyle = getColor(colors[i]);
        ctx.beginPath();
        ctx.roundRect(x - nodeSize / 2, y - nodeSize / 2, nodeSize, nodeSize, 12);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(18, nodeSize / 3)}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.value, x, y);

        if (node.next !== null && i < structure.length - 1) {
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
    };

    const renderStack = () => {
      // ✅ FIXED: Render from TOP (index 0) DOWNWARD - LIFO visualization
      structure.forEach((node, i) => {
        // Top of stack (i=0) at top of canvas, bottom at bottom
        const y = centerY - (count - i) * (nodeSize * 1.6) + nodeSize * 0.8;
        const x = centerX;
        
        // Top node bigger, bottom nodes smaller (perspective)
        const scale = 0.85 + (i / count) * 0.25;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // ✅ FIXED: Use correct index for colors (actual array index)
        ctx.fillStyle = getColor(colors[i]);
        ctx.beginPath();
        ctx.roundRect(-nodeSize / 2 * 0.95, -nodeSize / 2 * 1.2, nodeSize * 1.1, nodeSize * 1.8, 12);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(18, nodeSize / 3)}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.value, 0, 0);

        // Stack connection lines (vertical)
        if (i < structure.length - 1) {
          clearShadows(() => {
            ctx.strokeStyle = "#6b7280";
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(0, nodeSize / 2 * 1.2);
            ctx.lineTo(0, nodeSize / 2 * 1.8 + 8);
            ctx.lineTo(-8, nodeSize / 2 * 1.8 + 16);
            ctx.lineTo(8, nodeSize / 2 * 1.8 + 16);
            ctx.lineTo(0, nodeSize / 2 * 1.8 + 8);
            ctx.stroke();
          });
        }
        
        ctx.restore();
      });

      // Stack base line
      ctx.save();
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.shadowBlur = 0;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX - 80, centerY + nodeSize * 1.2);
      ctx.lineTo(centerX + 80, centerY + nodeSize * 1.2);
      ctx.stroke();
      ctx.restore();
    };

    const renderers = {
      linkedlist: renderLinkedList,
      stack: renderStack,
      queue: renderQueue,
      binarytree: () => renderTree(),
      binaryheap: () => renderTree()
    };

    renderers[dsType]?.() || renderLinkedList();
  }, [structure, colors, dsType, size]);

  return (
    <div className="w-full h-[500px] bg-black/20 rounded-xl border border-white/10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

// Polyfill roundRect
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
