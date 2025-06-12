import { Link } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white/10 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="font-bold text-xl">Bingo Admin</div>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/shops" className="hover:underline">Shops</Link>
        <button
          onClick={onLogout}
          className="ml-4 bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
