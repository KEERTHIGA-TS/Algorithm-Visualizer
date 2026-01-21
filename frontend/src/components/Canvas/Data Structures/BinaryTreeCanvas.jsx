// src/components/Canvas/Data Structures/BinaryTreeCanvas.jsx
import { useEffect, useRef } from "react";

export default function BinaryTreeCanvas({ structure, colors }) {
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
        const H_GAP = 40;

        const getColor = (key) => {
            const map = {
                active: "#10b981",
                visited: "#f59e0b",
                current: "#ef4444",
                default: "#475569",
            };
            return map[key] || map.default;
        };

        /* ================= SUBTREE WIDTH ================= */
        const subtreeWidth = (idx) => {
            if (idx == null || idx >= structure.length) return 0;

            const node = structure[idx];
            const left = subtreeWidth(node.left);
            const right = subtreeWidth(node.right);

            if (!left && !right) return NODE_RADIUS * 2;

            return left + right + H_GAP;
        };


        /* ================= DRAW ================= */
        const drawTree = (idx, x, y) => {
            if (idx == null || idx >= structure.length) return;
            const node = structure[idx];

            const leftW = subtreeWidth(node.left);
            const rightW = subtreeWidth(node.right);
            const childY = y + LEVEL_HEIGHT;

            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 2;

            // LEFT CHILD
            if (node.left != null) {
                const leftX = x - (rightW / 2 + H_GAP / 2);
                ctx.beginPath();
                ctx.moveTo(x, y + NODE_RADIUS);
                ctx.lineTo(leftX, childY - NODE_RADIUS);
                ctx.stroke();
                drawTree(node.left, leftX, childY);
            }

            // RIGHT CHILD
            if (node.right != null) {
                const rightX = x + (leftW / 2 + H_GAP / 2);
                ctx.beginPath();
                ctx.moveTo(x, y + NODE_RADIUS);
                ctx.lineTo(rightX, childY - NODE_RADIUS);
                ctx.stroke();
                drawTree(node.right, rightX, childY);
            }

            // NODE
            ctx.fillStyle = getColor(colors[idx]);
            ctx.beginPath();
            ctx.arc(x, y, NODE_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.value, x, y);
        };

        /* ================= START ================= */
        const totalWidth = subtreeWidth(0);
        const startX = rect.width / 2;
        const startY = 60;

        drawTree(0, startX, startY);
    }, [structure, colors]);

    return (
        <div className="w-full h-[520px] bg-black/20 rounded-xl border border-white/10 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
