import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion"; 
import axios from "axios"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import {
  faBox,
  faTruck,
  faShoppingCart,
  faChartLine,
  faCog,
  faUsers,
} from "@fortawesome/free-solid-svg-icons"; 

const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [metrics, setMetrics] = useState({
    inventoryCount: 0,
    supplierCount: 0,
    orderCount: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get(`${url}/api/dashboard/metrics`);
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="min-h-screen text-gray-900 flex flex-col items-center p-8"
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-center mt-10 mb-8 text-blue-800"
      >
        {user?.role.toUpperCase()} DASHBOARD
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2, 
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-sm h-15 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200">
           
            <h2 className="text-xl font-semibold mt-2 text-blue-800">Inventory</h2>
            <p className="text-2xl font-bold text-blue-900">{metrics.inventoryCount}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-sm h-15 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200">
    
            <h2 className="text-xl font-semibold mt-2 text-blue-800">Suppliers</h2>
            <p className="text-2xl font-bold text-blue-900">{metrics.supplierCount}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-sm h-15 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200">
        
            <h2 className="text-xl font-semibold mt-2 text-blue-800">Orders</h2>
            <p className="text-2xl font-bold text-blue-900">{metrics.orderCount}</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2, 
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/inventory"
            className="bg-white/90 backdrop-blur-sm h-48 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200"
          >
            <FontAwesomeIcon icon={faBox} className="text-blue-600 text-5xl" />
            <h2 className="text-xl font-semibold mt-4 text-blue-800">Inventory Management</h2>
            <p className="text-sm text-blue-600 mt-2">Manage your inventory efficiently</p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/suppliers"
            className="bg-white/90 backdrop-blur-sm h-48 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200"
          >
            <FontAwesomeIcon icon={faTruck} className="text-blue-600 text-5xl" />
            <h2 className="text-xl font-semibold mt-4 text-blue-800">Supplier Management</h2>
            <p className="text-sm text-blue-600 mt-2">Manage suppliers and orders</p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/orders"
            className="bg-white/90 backdrop-blur-sm h-48 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="text-blue-600 text-5xl" />
            <h2 className="text-xl font-semibold mt-4 text-blue-800">Order Processing</h2>
            <p className="text-sm text-blue-600 mt-2">Process and track orders</p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/replenishment"
            className="bg-white/90 backdrop-blur-sm h-48 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200"
          >
            <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-5xl" />
            <h2 className="text-xl font-semibold mt-4 text-blue-800">Replenishments</h2>
            <p className="text-sm text-blue-600 mt-2">Track and manage stock replenishments</p>
          </Link>
        </motion.div>

        
        {isAdmin() && (
          <motion.div variants={itemVariants}>
            <Link
              to="/users"
              className="bg-white/90 backdrop-blur-sm h-48 flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200"
            >
              <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-5xl" />
              <h2 className="text-xl font-semibold mt-4 text-blue-800">User Management</h2>
              <p className="text-sm text-blue-600 mt-2">Manage users and permissions</p>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;