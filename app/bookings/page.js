// app/bookings/page.js
"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../config";
import Link from "next/link";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, [router]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bookings List</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Client Name</th>
            <th className="py-2 px-4 border">Delivery Date</th>
            <th className="py-2 px-4 border">Payment Method</th>
            <th className="py-2 px-4 border">Total Fee</th>
          </tr>
        </thead>
        {/* <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="py-2 px-4 border">{booking.client_name}</td>
              <td className="py-2 px-4 border">{booking.delivery_date}</td>
              <td className="py-2 px-4 border">{booking.payment_method}</td>
              <td className="py-2 px-4 border">{booking.total_fee}</td>
            </tr>
          ))}
        </tbody> */}
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="py-2 px-4 border text-center">
                <Link href={`/bookings/${booking.id}`}>
                  {booking.client_name}
                </Link>
              </td>
              <td className="py-2 px-4 border text-center">
                {booking.delivery_date}
              </td>
              <td className="py-2 px-4 border text-center">
                {booking.payment_method}
              </td>
              <td className="py-2 px-4 border text-center">
                {booking.total_fee}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
