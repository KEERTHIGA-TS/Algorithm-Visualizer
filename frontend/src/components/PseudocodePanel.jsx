import { motion } from "framer-motion";

export default function PseudocodePanel({ code = [], currentLine = -1 }) {
  return (
    <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10">
      <h3 className="text-purple-400 font-semibold mb-4 text-lg">
        Pseudocode
      </h3>

      <div className="space-y-1 font-mono text-sm">
        {code.map((line, idx) => (
          <motion.div
            key={idx}
            layout
            initial={false}
            animate={{
              backgroundColor:
                idx === currentLine
                  ? "rgba(168, 85, 247, 0.25)"
                  : "transparent",
              color:
                idx === currentLine
                  ? "#e9d5ff"
                  : "#9ca3af",
            }}
            className="px-3 py-1 rounded-md whitespace-pre"
          >
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
