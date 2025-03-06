'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { FaSpinner, FaArrowLeft, FaPrint, FaEdit } from 'react-icons/fa';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState(booking?.payment_status || '');
  const [successMessage, setSuccessMessage] = useState('');

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
        setUpdatedPaymentStatus(data.payment_status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleUpdatePaymentStatus = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ payment_status: updatedPaymentStatus }),
      });
      if (!res.ok) {
        throw new Error('Failed to update payment status');
      }
      setSuccessMessage('Payment status updated successfully!');
      const updatedBooking = await res.json();
      setBooking(updatedBooking);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-[#8E1A2A] text-4xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#8E1A2A] p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/bookings')}
                className="text-white hover:text-gray-200 mr-4"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Booking Details</h1>
                <p className="text-gray-200 mt-1">Reference ID: {booking.id}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-white text-[#8E1A2A] rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
              <button
                onClick={() => router.push(`/bookings/${id}/edit`)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Client Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Client Name</p>
                <p className="text-lg font-medium text-gray-900">{booking.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-lg font-medium text-gray-900">{booking.address}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Current Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(booking.current_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(booking.delivery_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Return Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(booking.expected_return_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-lg font-medium text-gray-900">{booking.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full 
                  ${booking.payment_status === 'PAID' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'}`}
                >
                  {booking.payment_status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transport Cost</p>
                <p className="text-lg font-medium text-gray-900">₦{booking.transport_cost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Discount</p>
                <p className="text-lg font-medium text-gray-900">₦{booking.discount}</p>
              </div>
            </div>
          </div>

          {/* Update Payment Status */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Payment Status</h2>
            <select
              value={updatedPaymentStatus}
              onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
            >
              <option value="PAID">PAID</option>
              <option value="PAID_AND_SUPPLY">PAID AND SUPPLY</option>
              <option value="PENDING">PENDING</option>
            </select>
            <button
              onClick={handleUpdatePaymentStatus}
              className="mt-4 px-4 py-2 bg-[#8E1A2A] text-white rounded-md hover:bg-[#701521] transition-colors duration-200"
            >
              Update Payment Status
            </button>
            {successMessage && (
              <div className="mt-2 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
                <p>{successMessage}</p>
              </div>
            )}
          </div>

          {/* Rented Items */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rented Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {booking.rented_items && booking.rented_items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₦{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{item.price * item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-800 p-6 rounded-lg text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Total Fee</h2>
              <p className="text-2xl font-bold">₦{booking.total_fee}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
