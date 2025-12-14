import { Home, Package } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1E2430] text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 hover:bg-[#2A3242] p-2 rounded-lg"
        >
          <Home size={20} /> Home
        </Link>

        <Link
          to="/products"
          className="flex items-center gap-3 hover:bg-[#2A3242] p-2 rounded-lg"
        >
          <Package size={20} /> Products
        </Link>
      </nav>
    </div>
  );
}
