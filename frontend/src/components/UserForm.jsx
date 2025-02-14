import React, { useState } from "react";

const UserForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    role: initialData.role || "employee",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Edit User</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;