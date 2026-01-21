import { Link } from "react-router-dom";
import sortingImg from "../assets/categories/sorting.jpg";
import graphImg from "../assets/categories/graphs.jpg";
import structureImg from "../assets/categories/structures.jpg";

export default function Categories() {
    const categories = [
        {
            title: "Sorting Algorithms",
            description: "Visualize comparison & swapping based algorithms",
            image: sortingImg,
            path: "/category/sorting",
        },
        {
            title: "Graph Algorithms",
            description: "Traverse graphs & find shortest paths",
            image: graphImg,
            path: "/category/graphs",
        },
        {
            title: "Data Structures",
            description: "Understand stacks, queues, trees & lists",
            image: structureImg,
            path: "/category/structures",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white px-10 py-16">
            <h1 className="text-4xl font-bold mb-12 text-center">
                Choose a <span className="text-purple-400">Category</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {categories.map((cat) => (
                    <Link
                        key={cat.title}
                        to={cat.path}
                        className="group rounded-2xl overflow-hidden bg-black/40 border border-white/10 hover:border-purple-500/40 transition-all hover:scale-[1.03]"
                    >
                        {/* Image */}
                        <div className="aspect-[16/9] overflow-hidden">
                            <img
                                src={cat.image}
                                className="w-full h-full object-contain p-4"
                            />
                        </div>


                        {/* Content */}
                        <div className="p-6">
                            <h2 className="text-xl font-semibold group-hover:text-purple-400 transition">
                                {cat.title}
                            </h2>
                            <p className="text-gray-400 mt-2 text-sm">
                                {cat.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
