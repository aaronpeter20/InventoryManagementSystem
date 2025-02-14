import React, { useState } from "react";

const ReplenishmentForm = ({ inventory, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    item: "", 
    quantity: "",
    supplier: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formData.item || !formData.quantity) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const selectedItem = inventory.find((item) => item._id === formData.item);
    if (!selectedItem) {
      toast.error("Invalid item selected.");
      return;
    }
  
    const payload = {
      ...formData,
      supplier: selectedItem.supplier?._id, 
    };
  
    onSubmit(payload); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Item</label>
        <select
          name="item"
          value={formData.item}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select an item</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} (Supplier: {item.supplier?.name || "No Supplier"})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Submit Request
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full p-2 bg-gray-500 text-white rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default ReplenishmentForm;