import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import OrderForm from "../components/OrderForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCaretDown,faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { user,isEmployee, isManager } = useAuth();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("https://inventorymanagementsystem-backend-z88f.onrender.com/api/orders", {
        withCredentials: true, // ✅ Required for cookies
      });
  
      setOrders(data);
      setFilteredOrders(data); 
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };
  
  

  const fetchInventoryItems = async () => {
    try {
      const { data } = await axios.get(`${url}/api/inventory`);
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleCreateOrder = async (formData) => {
    try {
      await axios.post(`${url}/api/orders`, formData);
      fetchOrders();
      setShowForm(false);
      toast.success("Order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error.response?.data);
      toast.error("Failed to create order. Please try again.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${url}/api/orders/${orderId}`, { status });

      if (response.data.error) {
        window.alert("⚠️ Out of stock! Cannot approve this order."); 
        toast.error("Out of stock! Cannot approve this order.");
        fetchOrders(); 
      } else {
        fetchOrders();
        toast.success(`Order ${status} successfully!`);
      }
    } catch (error) {
      window.alert("⚠️ Out of stock! Cannot approve this order."); 
      toast.error("Out of stock! Cannot approve this order.");
      fetchOrders(); 
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${url}/api/orders/${orderId}`);
      fetchOrders();
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error.response?.data);
      toast.error("Failed to delete order. Please try again.");
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") {
      setFilteredOrders(orders); 
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered); 
    }
  };

  const countOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  useEffect(() => {
    fetchOrders();
    fetchInventoryItems(); 
  }, []);

  return (
    <div
      className="p-6 bg-cover bg-center min-h-screen bg-fixed"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')" }}
    >
      
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-white">Orders</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => filterOrdersByStatus("all")}
            className="bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-200 transition"
          >
            <h3 className="text-lg font-semibold text-blue-800">All Orders</h3>
            <p className="text-2xl font-bold text-blue-800">{orders.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => filterOrdersByStatus("approved")}
            className="bg-green-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-green-200 transition"
          >
            <h3 className="text-lg font-semibold text-green-800">Approved Orders</h3>
            <p className="text-2xl font-bold text-green-800">{countOrdersByStatus("approved")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => filterOrdersByStatus("pending")}
            className="bg-yellow-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-yellow-200 transition"
          >
            <h3 className="text-lg font-semibold text-yellow-800">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-800">{countOrdersByStatus("pending")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => filterOrdersByStatus("rejected")}
            className="bg-red-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-200 transition"
          >
            <h3 className="text-lg font-semibold text-red-800">Rejected Orders</h3>
            <p className="text-2xl font-bold text-red-800">{countOrdersByStatus("rejected")}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden"
        >
          <table className="w-full text-gray-900">
            <thead className="bg-white/40 text-gray-900">
              <tr>
                <th className="p-4 text-left border-b border-gray-300/50">Item</th>
                <th className="p-4 text-left border-b border-gray-300/50">Quantity</th>
                <th className="p-4 text-left border-b border-gray-300/50">Status</th>
                <th className="p-4 text-left border-b border-gray-300/50">Created By</th>
                <th className="p-4 text-left border-b border-gray-300/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-white/40 transition border-b border-gray-400/40"
                >
                  <td className="p-4">{order.item?.name}</td>
                  <td className="p-4">{order.quantity}</td>
                  <td className="p-4">{order.status}</td>
                  <td className="p-4">{order.employee?.name || "Unknown"}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      
                      {isManager() && order.status === "pending" && (
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="appearance-none p-2 pr-8 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <FontAwesomeIcon icon={faCaretDown} />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {isEmployee() && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setShowForm({ mode: "add" })}
            className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create Order
          </motion.button>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-xl w-[600px] relative shadow-2xl"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <h2 className="text-xl font-bold mb-6 text-blue-800">Create Order</h2>
              <OrderForm
                inventoryItems={inventoryItems}
                onSubmit={handleCreateOrder}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;