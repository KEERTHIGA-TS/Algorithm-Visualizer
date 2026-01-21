export default function ExplanationPanel({ text }) {
  return (
    <div className="bg-black/40 backdrop-blur rounded-2xl p-4 border border-white/10 min-h-[70px]">
      <h4 className="text-sm text-purple-400 mb-1">
        Explanation
      </h4>

      <p className="text-gray-300 text-sm">
        {text || "Operation explanation will appear here."}
      </p>
    </div>
  );
}
