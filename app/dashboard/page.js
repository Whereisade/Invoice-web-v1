// app/dashboard/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token, redirect to login
      router.push('/');
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the Omowunmi Kitchen Dashboard!</p>
      {/* Add any overview stats or quick links here */}
    </div>
  );
}
