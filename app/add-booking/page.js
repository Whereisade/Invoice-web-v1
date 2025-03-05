// app/add-booking/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

export default function AddBookingPage() {
  const [booking, setBooking] = useState({
    client_name: '',
    address: '',
    payment_method: 'POLARIS',
    delivery_date: '',
    current_date: '',
    expected_return_date: '',
    transport_cost: '',
    discount: '0',
    payment_status: 'PAID',
    rented_items: [{ name: '', price: '', unit: 1 }], // unit is now numeric
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
      const items = [...prev.rented_items];
      items[index] = { ...items[index], [name]: name === 'unit' ? Number(value) : value };
      return { ...prev, rented_items: items };
    });
  };

  const addItem = () => {
    setBooking((prev) => ({
      ...prev,
      rented_items: [...prev.rented_items, { name: '', price: '', unit: 1 }],
    }));
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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Booking</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Client Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={booking.client_name}
            onChange={(e) =>
              setBooking({ ...booking, client_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block">Address</label>
          <textarea
            className="border p-2 w-full"
            value={booking.address}
            onChange={(e) =>
              setBooking({ ...booking, address: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block">Payment Method</label>
          <select
            className="border p-2 w-full"
            value={booking.payment_method}
            onChange={(e) =>
              setBooking({ ...booking, payment_method: e.target.value })
            }
          >
            <option value="POLARIS">Polaris Bank</option>
            <option value="ACCESS">Access Bank</option>
            <option value="FIDELITY">Fidelity</option>
            <option value="GT">GT Bank</option>
            <option value="FIRST">First Bank</option>
          </select>
        </div>
        <div>
          <label className="block">Delivery Date</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={booking.delivery_date}
            onChange={(e) =>
              setBooking({ ...booking, delivery_date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block">Current Date</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={booking.current_date}
            onChange={(e) =>
              setBooking({ ...booking, current_date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block">Expected Return Date</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={booking.expected_return_date}
            onChange={(e) =>
              setBooking({ ...booking, expected_return_date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block">Transport Cost</label>
          <input
            type="number"
            step="0.01"
            className="border p-2 w-full"
            value={booking.transport_cost}
            onChange={(e) =>
              setBooking({ ...booking, transport_cost: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block">Discount</label>
          <input
            type="number"
            step="0.01"
            className="border p-2 w-full"
            value={booking.discount}
            onChange={(e) =>
              setBooking({ ...booking, discount: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block">Payment Status</label>
          <select
            className="border p-2 w-full"
            value={booking.payment_status}
            onChange={(e) =>
              setBooking({ ...booking, payment_status: e.target.value })
            }
          >
            <option value="PAID">PAID</option>
            <option value="PAID_AND_SUPPLY">PAID AND SUPPLY</option>
          </select>
        </div>
        <div>
          <h3 className="font-bold">Rented Items</h3>
          {booking.rented_items.map((item, index) => (
            <div key={index} className="mb-2 flex space-x-2">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                className="border p-2 w-1/3"
                value={item.name}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="Price"
                className="border p-2 w-1/3"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
              <input
                type="number"
                name="unit"
                placeholder="Unit (quantity)"
                className="border p-2 w-1/3"
                value={item.unit}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-blue-500">
            + Add another item
          </button>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Submit Booking
        </button>
      </form>
    </div>
  );
}
