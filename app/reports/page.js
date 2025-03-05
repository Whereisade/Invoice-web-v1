// app/reports/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { FaChartBar, FaSpinner, FaDownload, FaMoneyBillWave } from 'react-icons/fa';

export default function ReportsPage() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [revenue, setRevenue] = useState(null);
  const [bankFees, setBankFees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Protect the page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const fetchRevenue = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (month) queryParams.append('month', month);
      if (year) queryParams.append('year', year);

      const res = await fetch(`${API_BASE_URL}/reports/revenue/?${queryParams}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch revenue');
      }
      const data = await res.json();
      setRevenue(data.total_revenue);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBankFees = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/reports/bank-fees/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.fees_by_bank || data.fees_by_bank.length === 0) {
        setError("No bank fees recorded yet.");
        setBankFees([]);
      } else {
        setBankFees(data.fees_by_bank);
      }
    } catch (err) {
      console.error("Failed to fetch bank fees:", err);
      setError("Failed to fetch bank fees");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    fetchRevenue();
    fetchBankFees();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export functionality to be implemented');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#8E1A2A] p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-white">Financial Reports</h2>
              <p className="text-gray-200 mt-1">View revenue and bank fee reports</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white text-[#8E1A2A] rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Filter Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Reports</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                    placeholder="e.g., 3 for March"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year (Optional)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#8E1A2A] focus:ring focus:ring-[#8E1A2A] focus:ring-opacity-50"
                    placeholder="e.g., 2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-[#8E1A2A] text-white rounded-md hover:bg-[#701521] transition-colors duration-200"
                >
                  <FaChartBar className="mr-2" />
                  Generate Report
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <FaSpinner className="animate-spin text-[#8E1A2A] text-4xl" />
            </div>
          )}

          {/* Revenue Summary */}
          {revenue !== null && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Summary</h3>
                <div className="bg-[#8E1A2A] bg-opacity-10 p-3 rounded-full">
                  <FaMoneyBillWave className="w-6 h-6 text-[#8E1A2A]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">₦{revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                {month ? `Month: ${month}` : 'All months'} {year ? `Year: ${year}` : ''}
              </p>
            </div>
          )}

          {/* Bank Fees Table */}
          {bankFees.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Fees Breakdown</h3>
              
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Fees
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bankFees.map((bankFee, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bankFee.bank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{bankFee.total_fee.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {bankFees.map((bankFee, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                    <div className="text-sm font-medium text-gray-900">{bankFee.bank}</div>
                    <div className="text-lg font-bold text-[#8E1A2A] mt-1">
                      ₦{bankFee.total_fee.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
