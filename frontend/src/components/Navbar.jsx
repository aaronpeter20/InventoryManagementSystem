import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import React from "react";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/10 shadow-lg border-b border-white/20 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {!isAuthPage && (
          <button 
            onClick={() => navigate(-1)} 
            className="text-white bg-gray-700/30 hover:bg-gray-700/50 px-3 py-2 rounded-full transition flex items-center gap-2"
          >
            <FiArrowLeft className="text-lg" />
            Back
          </button>
        )}

        <div className={`${isAuthPage ? "flex-1 flex justify-center" : ""}`}>
          <h1 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
            Inventory<span className="text-yellow-300">Pro</span>
          </h1>
        </div>

        {user && !isAuthPage && (
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600 transition px-4 py-2 rounded-lg text-white"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        )}

        {!user && isAuthPage && <div className="w-[70px]"></div>}
      </div>
    </nav>
  );
};

export default Navbar;