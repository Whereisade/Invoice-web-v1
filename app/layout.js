

import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'Omowunmi Kitchen',
  description: 'Manage bookings and rentals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
