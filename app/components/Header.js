// "use client"

// import { useState } from 'react';
// import Link from 'next/link';

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-[#8E1A2A] text-white p-4 shadow-lg">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Omowunmi's Kitchen</h1>
          
//           {/* Hamburger Button */}
//           <button 
//             className="md:hidden p-2"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             <svg 
//               className="w-6 h-6" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               {isMenuOpen ? (
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2} 
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               ) : (
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2} 
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               )}
//             </svg>
//           </button>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex gap-4">
//             <Link href="/dashboard" className="hover:underline transition-colors duration-200 hover:text-gray-200">
//               Dashboard
//             </Link>
//             <Link href="/bookings" className="hover:underline transition-colors duration-200 hover:text-gray-200">
//               Bookings
//             </Link>
//             <Link href="/add-booking" className="hover:underline transition-colors duration-200 hover:text-gray-200">
//               Add Booking
//             </Link>
//             <Link href="/reports" className="hover:underline transition-colors duration-200 hover:text-gray-200">
//               Reports
//             </Link>
//             <Link href="/" className="hover:underline transition-colors duration-200 hover:text-gray-200">
//               Logout
//             </Link>
//           </nav>
//         </div>

//         {/* Mobile Navigation */}
//         <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-2`}>
//           <Link href="/dashboard" className="block py-2 hover:bg-[#701521] px-2 rounded transition-colors duration-200">
//             Dashboard
//           </Link>
//           <Link href="/bookings" className="block py-2 hover:bg-[#701521] px-2 rounded transition-colors duration-200">
//             Bookings
//           </Link>
//           <Link href="/add-booking" className="block py-2 hover:bg-[#701521] px-2 rounded transition-colors duration-200">
//             Add Booking
//           </Link>
//           <Link href="/reports" className="block py-2 hover:bg-[#701521] px-2 rounded transition-colors duration-200">
//             Reports
//           </Link>
//           <Link href="/" className="block py-2 hover:bg-[#701521] px-2 rounded transition-colors duration-200">
//             Logout
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// } 

"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold">Omowunmi&apos;s Kitchen</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link 
              href="/dashboard" 
              className="px-3 py-1 rounded transition-colors duration-200 hover:bg-red-700"
            >
              Dashboard
            </Link>
            <Link 
              href="/bookings" 
              className="px-3 py-1 rounded transition-colors duration-200 hover:bg-red-700"
            >
              Bookings
            </Link>
            <Link 
              href="/add-booking" 
              className="px-3 py-1 rounded transition-colors duration-200 hover:bg-red-700"
            >
              Add Booking
            </Link>
            <Link 
              href="/reports" 
              className="px-3 py-1 rounded transition-colors duration-200 hover:bg-red-700"
            >
              Reports
            </Link>
            <Link 
              href="/" 
              className="px-3 py-1 rounded transition-colors duration-200 hover:bg-red-700"
            >
              Logout
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/dashboard" 
                className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-red-700"
              >
                Dashboard
              </Link>
              <Link 
                href="/bookings" 
                className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-red-700"
              >
                Bookings
              </Link>
              <Link 
                href="/add-booking" 
                className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-red-700"
              >
                Add Booking
              </Link>
              <Link 
                href="/reports" 
                className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-red-700"
              >
                Reports
              </Link>
              <Link 
                href="/" 
                className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-red-700"
              >
                Logout
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

