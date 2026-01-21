import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white px-6">
      {/* Center Wrapper */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center">

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Visualize Logic.{" "}
          <span className="text-purple-400">Master Algorithms.</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 max-w-2xl mb-10 text-lg">
          Learn how algorithms work through live animations and step-by-step explanations.
        </p>

        {/* CTA Button */}
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold
           hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30"

        >
          Start Visualizing →
        </Link>

      </div>
    </div>
  );
}
