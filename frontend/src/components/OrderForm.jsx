import React,{ useState } from "react";

const OrderForm = ({ inventoryItems, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    item: "", 
    quantity: "", 
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
          {inventoryItems.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} (Quantity: {item.quantity})
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
        Save
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

export default OrderForm;