// ============================================
// frontend/src/App.jsx - FIXED ROUTES
// ============================================
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Visualizer from "./pages/Visualizer/Visualizer";
import GraphVisualizer from "./pages/Visualizer/GraphVisualizer";
import StackVisualizer from "./pages/Visualizer/DataStructures/StackVisualizer";
import LinkedListVisualizer from "./pages/Visualizer/DataStructures/LinkedListVisualizer";
import QueueVisualizer from "./pages/Visualizer/DataStructures/QueueVisualizer";
import BinaryTreeVisualizer from "./pages/Visualizer/DataStructures/BinaryTreeVisualizer";
import BinaryHeapVisualizer from "./pages/Visualizer/DataStructures/BinaryHeapVisualizer";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:type" element={<Category />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ✅ PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* ✅ SORTING ALGORITHMS - Support both /visualizer and /visualize */}
          <Route path="/visualizer/:algo" element={<Visualizer />} />
          <Route path="/visualize/:algo" element={<Visualizer />} />
          
          {/* ✅ GRAPHS */}
          <Route path="/graphs/:algo" element={<GraphVisualizer />} />
          <Route path="/visualize/graphs/:algo" element={<GraphVisualizer />} />
          
          {/* ✅ DATA STRUCTURES */}
          <Route path="/structures/stack" element={<StackVisualizer />} />
          <Route path="/visualize/structures/stack" element={<StackVisualizer />} />
          
          <Route path="/structures/linkedlist" element={<LinkedListVisualizer />} />
          <Route path="/visualize/structures/linkedlist" element={<LinkedListVisualizer />} />
          
          <Route path="/structures/queue" element={<QueueVisualizer />} />
          <Route path="/visualize/structures/queue" element={<QueueVisualizer />} />
          
          <Route path="/structures/binarytree" element={<BinaryTreeVisualizer />} />
          <Route path="/visualize/structures/binarytree" element={<BinaryTreeVisualizer />} />
          
          <Route path="/structures/binaryheap" element={<BinaryHeapVisualizer />} />
          <Route path="/visualize/structures/binaryheap" element={<BinaryHeapVisualizer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}