'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch booking details
    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch booking details: ${res.status}`);
        }
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookingDetails();
  }, [id, router]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!booking) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Booking Details</h1>
      <p><strong>Client Name:</strong> {booking.client_name}</p>
      <p><strong>Address:</strong> {booking.address}</p>
      <p><strong>Payment Method:</strong> {booking.payment_method}</p>
      <p><strong>Delivery Date:</strong> {booking.delivery_date}</p>
      <p><strong>Current Date:</strong> {booking.current_date}</p>
      <p><strong>Expected Return Date:</strong> {booking.expected_return_date}</p>
      <p><strong>Transport Cost:</strong> {booking.transport_cost}</p>
      <p><strong>Discount:</strong> {booking.discount}</p>
      <p><strong>Payment Status:</strong> {booking.payment_status}</p>
      <p><strong>Total Fee:</strong> {booking.total_fee}</p>
      <h2 className="text-2xl font-bold mt-4">Rented Items</h2>
      {booking.rented_items && booking.rented_items.length > 0 ? (
        <ul className="list-disc pl-6">
          {booking.rented_items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.price} (Unit: {item.unit})
            </li>
          ))}
        </ul>
      ) : (
        <p>No rented items available.</p>
      )}
    </div>
  );
}
