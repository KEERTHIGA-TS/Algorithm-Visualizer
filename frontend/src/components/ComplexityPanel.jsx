export default function ComplexityPanel({ data }) {
  if (!data) return null;

  return (
    <div className="bg-black/50 backdrop-blur rounded-2xl p-5 border border-white/10">
      <h3 className="text-purple-400 font-semibold text-lg mb-3">
        Complexity Analysis
      </h3>

      <div className="space-y-2 text-gray-300 text-sm">
        <p>
          <span className="font-medium text-white">Best Case:</span>{" "}
          {data.best}
        </p>
        <p>
          <span className="font-medium text-white">Average Case:</span>{" "}
          {data.average}
        </p>
        <p>
          <span className="font-medium text-white">Worst Case:</span>{" "}
          {data.worst}
        </p>
        <p>
          <span className="font-medium text-white">Space:</span>{" "}
          {data.space}
        </p>
      </div>
    </div>
  );
}
