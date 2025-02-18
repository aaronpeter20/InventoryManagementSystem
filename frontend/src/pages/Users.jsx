import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import UserForm from "../components/UserForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash,faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isAdmin } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${url}/api/users`);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${url}/api/users/${userId}`);
      fetchUsers(); 
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error.response?.data);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleUpdateUserRole = async (userId, updatedData) => {
    try {
      await axios.put(`${url}/api/users/${userId}`, updatedData);
      fetchUsers(); 
      toast.success("User role updated successfully!");
      setShowForm(false); 
    } catch (error) {
      console.error("Error updating user role:", error.response?.data);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/soft-circle-scales.png')" }}
    >
  
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-white">Users</h1>

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
                <th className="p-4 text-left border-b border-gray-300/50">Email</th>
                <th className="p-4 text-left border-b border-gray-300/50">Role</th>
                {isAdmin() && <th className="p-4 text-left border-b border-gray-300/50">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-white/40 transition border-b border-gray-400/40"
                >
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  {isAdmin() && (
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user); 
                            setShowForm(true); 
                          }}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
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

              <h2 className="text-xl font-bold mb-6 text-blue-800">Edit User</h2>
              <UserForm
                initialData={selectedUser} 
                onSubmit={(updatedData) => handleUpdateUserRole(selectedUser._id, updatedData)} 
                onCancel={() => setShowForm(false)} 
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;