export default function AlgorithmInfoPanel({ name, description, complexity }) {
  return (
    <div className="bg-black/60 backdrop-blur-md text-white p-4 rounded-2xl shadow-lg border border-white/10">
      <h2 className="text-xl font-bold mb-2 text-indigo-400">
        {name}
      </h2>

      <p className="text-sm text-gray-300 mb-3">
        {description}
      </p>

      {complexity && (
        <div className="text-xs space-y-1">
          <p>
            <span className="font-semibold text-white">Best:</span>{" "}
            {complexity.best}
          </p>
          <p>
            <span className="font-semibold text-white">Average:</span>{" "}
            {complexity.average}
          </p>
          <p>
            <span className="font-semibold text-white">Worst:</span>{" "}
            {complexity.worst}
          </p>
          <p>
            <span className="font-semibold text-white">Space:</span>{" "}
            {complexity.space}
          </p>
        </div>
      )}
    </div>
  );
}
