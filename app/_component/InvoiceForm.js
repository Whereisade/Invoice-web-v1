'use client'
import { useState } from 'react';
import InvoicePDF from './InvoicePDF';

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    items: [{ name: '', price: '' }],
    address: '',
  });

  const handleChange = (e, index, field) => {
    if (field === 'item') {
      const newItems = [...formData.items];
      newItems[index][e.target.name] = e.target.value;
      setFormData({ ...formData, items: newItems });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', price: '' }],
    });
  };

  const totalPrice = formData.items.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0
  );

  return (
    <div>
      <h1>Create Invoice</h1>
      <form>
        <label>Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
        />
        
        <label>Address (Optional):</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <h2>Items</h2>
        {formData.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleChange(e, index, 'item')}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleChange(e, index, 'item')}
            />
          </div>
        ))}

        <button type="button" onClick={addItem}>
          Add Item
        </button>
      </form>

      <h3>Total Price: ${totalPrice}</h3>
      <InvoicePDF formData={{ ...formData, totalPrice }} />
    </div>
  );
}
