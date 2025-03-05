// app/reports/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

export default function ReportsPage() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [revenue, setRevenue] = useState(null);
  const [bankFees, setBankFees] = useState([]);
  const [error, setError] = useState('');

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
      setRevenue(data.total_revenue); // or however your API returns it
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    fetchRevenue();
    fetchBankFees();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <div>
          <label className="block">Month (optional)</label>
          <input
            type="number"
            className="border p-2 w-full"
            placeholder="e.g., 3 for March"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Year (optional)</label>
          <input
            type="number"
            className="border p-2 w-full"
            placeholder="e.g., 2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Get Reports
        </button>
      </form>

      {revenue !== null && (
        <div className="mb-4">
          <h3 className="font-bold">Total Revenue</h3>
          <p className="text-xl">{revenue}</p>
        </div>
      )}

      {bankFees.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Total Fees by Bank</h3>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Bank</th>
                <th className="py-2 px-4 border">Total Fees</th>
              </tr>
            </thead>
            <tbody>
              {bankFees.map((bankFee, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{bankFee.bank}</td>
                  <td className="py-2 px-4 border">{bankFee.total_fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
