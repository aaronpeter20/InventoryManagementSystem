import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import React from "react";

const Sidebar = () => {
  const { user, isAdmin, isManager } = useAuth();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/inventory" className="block hover:bg-gray-700 p-2 rounded">
            Inventory
          </Link>
        </li>
        <li>
          <Link to="/suppliers" className="block hover:bg-gray-700 p-2 rounded">
            Suppliers
          </Link>
        </li>
        <li>
          <Link to="/orders" className="block hover:bg-gray-700 p-2 rounded">
            Orders
          </Link>
        </li>
        {isAdmin() && (
          <li>
            <Link to="/users" className="block hover:bg-gray-700 p-2 rounded">
              Users
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;