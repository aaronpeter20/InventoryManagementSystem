import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import ReplenishmentForm from "../components/ReplenishmentForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";

const Replenishment = () => {
  const [inventory, setInventory] = useState([]);
  const [replenishments, setReplenishments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]); 
  const { isAdmin, isManager } = useAuth();

  const [token, setToken] = useState(localStorage.getItem("token"));

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${url}/api/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setInventory(data);
    } catch (error) {
      setError("Failed to fetch inventory. Please try again.");
      toast.error("Failed to fetch inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReplenishments = async () => {
    try {
      const { data } = await axios.get(`${url}/api/replenishment`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setReplenishments(data);
      setFilteredRequests(data); 
    } catch (error) {
      console.error("Error fetching replenishments:", error);
    }
  };

  const handleAddRequest = async (formData) => {
    try {
      console.log("Submitting Replenishment Request:", formData); 
      await axios.post(`${url}/api/replenishment`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      fetchReplenishments();
      setShowForm(false);
      toast.success("Replenishment request submitted successfully!");
    } catch (error) {
      console.error("Error adding request:", error.response?.data); 
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await axios.put(`${url}/api/replenishment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      fetchReplenishments();
      toast.success("Replenishment request approved!");
    } catch (error) {
      console.error("Error approving request:", error.response?.data);
      toast.error("Failed to approve request. Please try again.");
    }
  };

  const filterRequestsByStatus = (status) => {
    if (status === "all") {
      setFilteredRequests(replenishments); 
    } else {
      const filtered = replenishments.filter((req) => req.status === status);
      setFilteredRequests(filtered); 
    }
  };

  const countRequestsByStatus = (status) => {
    return replenishments.filter((req) => req.status === status).length;
  };

  useEffect(() => {
    fetchInventory();
    fetchReplenishments();
  }, []);

  return (
    <div
      className="p-6 bg-cover bg-center min-h-screen bg-fixed"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')" }}
    >
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-white">Replenishment Requests</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => filterRequestsByStatus("Approved")}
            className="bg-green-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-green-200 transition"
          >
            <h3 className="text-lg font-semibold text-green-800">Approved Requests</h3>
            <p className="text-2xl font-bold text-green-800">{countRequestsByStatus("Approved")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => filterRequestsByStatus("Pending")}
            className="bg-yellow-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-yellow-200 transition"
          >
            <h3 className="text-lg font-semibold text-yellow-800">Pending Requests</h3>
            <p className="text-2xl font-bold text-yellow-800">{countRequestsByStatus("Pending")}</p>
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
                <th className="p-4 text-left border-b border-gray-300/50">Supplier</th>
                <th className="p-4 text-left border-b border-gray-300/50">Status</th>
                {isAdmin() && <th className="p-4 text-left border-b border-gray-300/50">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <motion.tr
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-white/40 transition border-b border-gray-400/40"
                >
                  <td className="p-4">{req.item?.name}</td>
                  <td className="p-4">{req.quantity}</td>
                  <td className="p-4">{req.supplier?.name}</td>
                  <td className="p-4">{req.status}</td>
                  {isAdmin() && req.status === "Pending" && (
                    <td className="p-4">
                      <button
                        onClick={() => handleApproveRequest(req._id)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Approve
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {isManager() && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setShowForm(true)}
            className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Request Replenishment
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

              <h2 className="text-xl font-bold mb-6 text-blue-800">Request Replenishment</h2>
              <ReplenishmentForm
                inventory={inventory}
                onSubmit={handleAddRequest}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Replenishment;