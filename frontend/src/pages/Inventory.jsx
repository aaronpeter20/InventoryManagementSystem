import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import InventoryForm from "../components/InventoryForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAdmin, isManager } = useAuth();

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${url}/api/inventory`);
      setInventory(data);
    } catch (error) {
      setError("Failed to fetch inventory. Please try again.");
      toast.error("Failed to fetch inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data } = await axios.get(`${url}/api/suppliers`);
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleAddItem = async (formData) => {
    try {
      await axios.post(`${url}/api/inventory`, formData);
      fetchInventory();
      setShowForm(false);
      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error.response?.data);
      toast.error("Failed to add item. Please try again.");
    }
  };

  const handleEditItem = async (id, updatedData) => {
    try {
      await axios.put(`${url}/api/inventory/${id}`, updatedData);
      fetchInventory();
      toast.success("Item updated successfully!");
      setShowForm(false);
    } catch (error) {
      console.error("Error updating item:", error.response?.data);
      toast.error("Failed to update item. Please try again.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${url}/api/inventory/${id}`);
      fetchInventory();
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error.response?.data);
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchInventory();
    fetchSuppliers();
  }, []);

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')" }}
    >
      <h1 className="text-3xl font-bold mb-4 text-white">Inventory</h1>

       <div className="relative mb-4 flex items-center">
  
        <motion.button
          initial={{ width: "40px" }}
          animate={{ width: showSearch ? "300px" : "40px" }}
          transition={{ duration: 0.3 }}
          className="flex items-center bg-white shadow-lg rounded-full overflow-hidden transition-all"
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="text-gray-500 p-3 cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          />
          {showSearch && (
            <input
              type="text"
              placeholder="Search inventory..."
              className="p-2 w-full outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setShowSearch(false)} 
              autoFocus
            />
          )}
        </motion.button>
      </div>


      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white/30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden"
      >
        <table className="w-full text-gray-900">
          <thead className="bg-white/40 text-gray-900">
            <tr>
              <th className="p-3 text-left border-b border-gray-300/50">Name</th>
              <th className="p-3 text-left border-b border-gray-300/50">Quantity</th>
              <th className="p-3 text-left border-b border-gray-300/50">Price</th>
              <th className="p-3 text-left border-b border-gray-300/50">Supplier</th>
              {(isAdmin() || isManager()) && <th className="p-3 text-left border-b border-gray-300/50">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <motion.tr
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-white/40 transition border-b border-gray-400/40"
              >
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">${item.price}</td>
                <td className="p-3">{item.supplier?.name}</td>
                {(isAdmin() || isManager()) && (
                  <td className="p-3">
                    <div className="flex space-x-2">
                  
                      <button
                        onClick={() => {
                          setShowForm({ mode: "edit", item });
                        }}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {(isAdmin() || isManager()) && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => setShowForm({ mode: "add" })}
          className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Item
        </motion.button>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-xl w-[600px]"
          >
            <h2 className="text-xl font-bold mb-6 text-blue-800">
              {showForm.mode === "add" ? "Add Inventory Item" : "Edit Inventory Item"}
            </h2>
            <InventoryForm
              suppliers={suppliers}
              onSubmit={(id, updatedData) =>
                showForm.mode === "add" ? handleAddItem(updatedData) : handleEditItem(id, updatedData)
              }
              onCancel={() => setShowForm(false)}
              initialData={showForm.mode === "edit" ? showForm.item : null}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inventory;