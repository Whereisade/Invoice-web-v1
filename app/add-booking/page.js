// app/add-booking/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function AddBookingPage() {
  const [booking, setBooking] = useState({
    client_name: '',
    address: '',
    payment_method: 'POLARIS',
    delivery_date: '',
    current_date: new Date().toISOString().split('T')[0], // Set current date by default
    expected_return_date: '',
    transport_cost: '',
    discount: '0',
    payment_status: 'PAID',
    // Use 'rented_items_data' here to match the serializer's write-only field
    rented_items_data: [{ name: '', price: '', unit: 1 }],
  });
  const [error, setError] = useState('');
  const router = useRouter();

  // Protect the page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setBooking((prev) => {
      const items = [...prev.rented_items_data];
      items[index] = { ...items[index], [name]: name === 'unit' ? Number(value) : value };
      return { ...prev, rented_items_data: items };
    });
  };

  const addItem = () => {
    setBooking((prev) => ({
      ...prev,
      rented_items_data: [...prev.rented_items_data, { name: '', price: '', unit: 1 }],
    }));
  };

  const removeItem = (index) => {
    if (booking.rented_items_data.length > 1) {
      setBooking((prev) => ({
        ...prev,
        rented_items_data: prev.rented_items_data.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(booking),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error creating booking');
      }
      router.push('/bookings');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#8E1A2A] p-6">
          <h2 className="text-2xl font-bold text-white">Create New Booking</h2>
          <p className="text-gray-200 mt-1">Fill in the details below to create a new booking</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.client_name}
                  onChange={(e) => setBooking({ ...booking, client_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.address}
                  onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.current_date}
                  onChange={(e) => setBooking({ ...booking, current_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.delivery_date}
                  onChange={(e) => setBooking({ ...booking, delivery_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.expected_return_date}
                  onChange={(e) => setBooking({ ...booking, expected_return_date: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.payment_method}
                  onChange={(e) => setBooking({ ...booking, payment_method: e.target.value })}
                >
                  <option value="POLARIS">Polaris Bank</option>
                  <option value="ACCESS">Access Bank</option>
                  <option value="FIDELITY">Fidelity</option>
                  <option value="GT">GT Bank</option>
                  <option value="FIRST">First Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport Cost</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.transport_cost}
                  onChange={(e) => setBooking({ ...booking, transport_cost: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.discount}
                  onChange={(e) => setBooking({ ...booking, discount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                  value={booking.payment_status}
                  onChange={(e) => setBooking({ ...booking, payment_status: e.target.value })}
                >
                  <option value="PAID">PAID</option>
                  <option value="PAID_AND_SUPPLY">PAID AND SUPPLY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rented Items Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rented Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-4 py-2 bg-[#8E1A2A] text-white rounded-md hover:bg-[#701521] transition-colors duration-200"
              >
                <FaPlus className="mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {booking.rented_items_data.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Item Name"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="Price"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                    <input
                      type="number"
                      name="unit"
                      placeholder="Quantity"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  {booking.rented_items_data.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/bookings')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#8E1A2A] text-white rounded-md hover:bg-[#701521] transition-colors duration-200"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
