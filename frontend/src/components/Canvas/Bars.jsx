export default function Bars({ array, colors }) {
  return (
    <div className="flex items-end gap-1 h-80 w-full">
      {array.map((val, idx) => {
        let color = "#60a5fa"; // default

        if (colors[idx] === "compare") color = "#facc15";
        if (colors[idx] === "swap") color = "#ef4444";
        if (colors[idx] === "sorted") color = "#22c55e";

        return (
          <div
            key={idx}
            className="flex-1 rounded-md transition-all duration-200"
            style={{ height: `${val}px`, backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
