// src/components/Canvas/Data Structures/StackCanvas.jsx
import { useEffect, useRef } from "react";

export default function StackCanvas({ structure, colors }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    /* ============================
       DYNAMIC CONSTANTS 
    ============================ */
    const ITEM_HEIGHT = 70;
    const ITEM_WIDTH = 235;
    const WALL_WIDTH = 8;
    const PADDING_TOP = 50;
    const PADDING_BOTTOM = 50;
    
    // ✅ Calculate required canvas height based on stack size
    const stackItemsHeight = structure.length * ITEM_HEIGHT;
    const CANVAS_HEIGHT = Math.max(500, stackItemsHeight + PADDING_TOP + PADDING_BOTTOM);
    
    // Set canvas dimensions
    const canvasWidth = 400; // Fixed width
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = canvasWidth * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    
    ctx.scale(dpr, dpr);

    const centerX = canvasWidth / 2;

    /* ============================
       COLORS
    ============================ */
    const getColor = (key) => {
      const map = {
        active: "#a78bfa",
        visited: "#f59e0b",
        current: "#ef4444",
        default: "#e9d5ff",
      };
      return map[key] || map.default;
    };

    /* ============================
       BACKGROUND
    ============================ */
    ctx.fillStyle = "rgba(30, 41, 59, 0.95)";
    ctx.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);

    /* ============================
       STACK CONTAINER HEIGHT
    ============================ */
    const containerHeight = Math.max(300, stackItemsHeight + 80);
    const containerBottom = CANVAS_HEIGHT - PADDING_BOTTOM;
    const containerTop = containerBottom - containerHeight;

    /* ============================
       DRAW WALLS
    ============================ */
    ctx.fillStyle = "#94a3b8";

    // Left wall
    ctx.fillRect(
      centerX - ITEM_WIDTH / 2 - WALL_WIDTH,
      containerTop,
      WALL_WIDTH,
      containerHeight
    );

    // Right wall
    ctx.fillRect(
      centerX + ITEM_WIDTH / 2,
      containerTop,
      WALL_WIDTH,
      containerHeight
    );

    // Bottom wall
    ctx.fillRect(
      centerX - ITEM_WIDTH / 2 - WALL_WIDTH,
      containerBottom - WALL_WIDTH,
      ITEM_WIDTH + WALL_WIDTH * 2,
      WALL_WIDTH
    );

    /* ============================
       DRAW STACK ITEMS (BOTTOM → TOP)
    ============================ */
    const itemsStartY = containerBottom - WALL_WIDTH - 20;

    structure.forEach((node, i) => {
      const y = itemsStartY - (i + 1) * ITEM_HEIGHT;
      const x = centerX - ITEM_WIDTH / 2;

      // Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Box
      ctx.fillStyle = getColor(colors[i]);
      ctx.beginPath();
      ctx.roundRect(x, y, ITEM_WIDTH, ITEM_HEIGHT - 10, 14);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Text
      ctx.fillStyle = "#4c1d95";
      ctx.font = "bold 28px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.value, centerX, y + (ITEM_HEIGHT - 10) / 2);
    });

    /* ============================
       TOP LABEL
    ============================ */
    if (structure.length > 0) {
      const topItemY = itemsStartY - structure.length * ITEM_HEIGHT;
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("← TOP", centerX + ITEM_WIDTH / 2 + 16, topItemY + 35);
    }

    // ✅ Auto-scroll to show top of stack when structure changes
    if (containerRef.current && structure.length > 0) {
      setTimeout(() => {
        containerRef.current.scrollTop = 0;
      }, 50);
    }
  }, [structure, colors]);

  // Polyfill for roundRect
  if (typeof CanvasRenderingContext2D.prototype.roundRect === "undefined") {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-slate-900/50 flex justify-center"
      style={{
        scrollBehavior: 'smooth'
      }}
    >
      <canvas
        ref={canvasRef}
        className="block"
      />
    </div>
  );
}