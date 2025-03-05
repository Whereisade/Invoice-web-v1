'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaUsers } from 'react-icons/fa';
import { API_BASE_URL } from '../../config';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    todayBookings: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalCustomers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch all bookings
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const bookingsData = await bookingsRes.json();

        // Fetch revenue data for current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        const revenueRes = await fetch(
          `${API_BASE_URL}/reports/revenue/?month=${currentMonth}&year=${currentYear}`, {
          headers: { Authorization: `Token ${token}` },
        });
        const revenueData = await revenueRes.json();

        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookingsData.filter(booking => 
          booking.delivery_date === today
        );

        // Get unique customers
        const uniqueCustomers = new Set(bookingsData.map(booking => booking.client_name));

        // Calculate monthly growth (comparing to last month's revenue)
        const lastMonthRes = await fetch(
          `${API_BASE_URL}/reports/revenue/?month=${currentMonth - 1}&year=${currentYear}`, {
          headers: { Authorization: `Token ${token}` },
        });
        const lastMonthData = await lastMonthRes.json();
        
        const monthlyGrowth = lastMonthData.total_revenue 
          ? ((revenueData.total_revenue - lastMonthData.total_revenue) / lastMonthData.total_revenue) * 100 
          : 0;

        // Update stats
        setStats({
          todayBookings: todayBookings.length,
          totalRevenue: revenueData.total_revenue || 0,
          monthlyGrowth: monthlyGrowth,
          totalCustomers: uniqueCustomers.size
        });

        // Set recent bookings (last 3)
        setRecentBookings(bookingsData.slice(0, 3));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#8E1A2A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
            </div>
            <div className="bg-[#8E1A2A] bg-opacity-10 p-3 rounded-full">
              <FaCalendarAlt className="w-6 h-6 text-[#8E1A2A]" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue}</p>
            </div>
            <div className="bg-green-500 bg-opacity-10 p-3 rounded-full">
              <FaMoneyBillWave className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyGrowth.toFixed(1)}%</p>
            </div>
            <div className="bg-blue-500 bg-opacity-10 p-3 rounded-full">
              <FaChartLine className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="bg-purple-500 bg-opacity-10 p-3 rounded-full">
              <FaUsers className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/add-booking')}
            className="flex items-center justify-center p-4 bg-[#8E1A2A] text-white rounded-lg hover:bg-[#701521] transition duration-200"
          >
            <FaCalendarAlt className="mr-2" />
            New Booking
          </button>
          <button
            onClick={() => router.push('/bookings')}
            className="flex items-center justify-center p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            <FaUsers className="mr-2" />
            View All Bookings
          </button>
          <button
            onClick={() => router.push('/reports')}
            className="flex items-center justify-center p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            <FaChartLine className="mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">New booking: {booking.client_name}</p>
                <p className="text-sm text-gray-500">
                  Delivery Date: {booking.delivery_date} &#8226; Total: ₦{booking.total_fee}
                </p>
              </div>
              <button 
                onClick={() => router.push(`/bookings/${booking.id}`)}
                className="text-[#8E1A2A] hover:text-[#701521]"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
