
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Omowunmi Kitchen',
  description: 'Manage bookings and rentals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <header className="bg-blue-600 text-white p-4">
          <nav className="flex space-x-4">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/bookings" className="hover:underline">
              Bookings
            </Link>
            <Link href="/add-booking" className="hover:underline">
              Add Booking
            </Link>
            <Link href="/reports" className="hover:underline">
              Reports
            </Link>
            <Link href="/" className="hover:underline">
              Logout
            </Link>
          </nav>
        </header>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
