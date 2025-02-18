import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import SupplierForm from "../components/SupplierForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAdmin, isManager } = useAuth();

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${url}/api/suppliers`);
      setSuppliers(data);
    } catch (error) {
      setError("Failed to fetch suppliers. Please try again.");
      toast.error("Failed to fetch suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (formData) => {
    try {
      await axios.post(`${url}/api/suppliers`, formData);
      fetchSuppliers();
      setShowForm(false);
      toast.success("Supplier added successfully!");
    } catch (error) {
      toast.error("Failed to add supplier. Please try again.");
    }
  };

  const handleEditSupplier = async (id, updatedData) => {
    try {
      await axios.put(`${url}/api/suppliers/${id}`, updatedData);
      fetchSuppliers();
      toast.success("Supplier updated successfully!");
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to update supplier. Please try again.");
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`${url}/api/suppliers/${id}`);
      fetchSuppliers();
      toast.success("Supplier deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete supplier. Please try again.");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')" }}
    >
      
        <h1 className="text-3xl font-bold mb-4 text-white">Suppliers</h1>

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
                  placeholder="Search suppliers..."
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
                <th className="p-4 text-left border-b border-gray-300/50">Name</th>
                <th className="p-4 text-left border-b border-gray-300/50">Contact</th>
                <th className="p-4 text-left border-b border-gray-300/50">Email</th>
                {(isAdmin() || isManager()) && (
                  <th className="p-4 text-left border-b border-gray-300/50">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <motion.tr
                  key={supplier._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-white/40 transition border-b border-gray-400/40"
                >
                  <td className="p-4">{supplier.name}</td>
                  <td className="p-4">{supplier.contact}</td>
                  <td className="p-4">{supplier.email}</td>
                  {(isAdmin() || isManager()) && (
                    <td className="p-4">
                      <div className="flex space-x-2">
                    
                        <button
                          onClick={() => {
                            setShowForm({ mode: "edit", supplier });
                          }}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        
                        <button
                          onClick={() => handleDeleteSupplier(supplier._id)}
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
            Add Supplier
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

              <h2 className="text-xl font-bold mb-6 text-blue-800">
                {showForm.mode === "add" ? "Add Supplier" : "Edit Supplier"}
              </h2>
              <SupplierForm
                onSubmit={(formData) => {
                  if (showForm.mode === "add") {
                    handleAddSupplier(formData);
                  } else {
                    handleEditSupplier(showForm.supplier._id, formData);
                  }
                }}
                onCancel={() => setShowForm(false)}
                initialData={showForm.mode === "edit" ? showForm.supplier : {}}
              />
            </motion.div>
          </div>
        )}
      </div>
    
  );
};

export default Suppliers;