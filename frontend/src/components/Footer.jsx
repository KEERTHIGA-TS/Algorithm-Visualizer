export default function Footer() {
  return (
    <footer className="mt-10 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} Algorithm Visualizer · Built with React
      </p>
    </footer>
  );
}
