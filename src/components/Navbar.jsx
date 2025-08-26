import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-white tracking-tight">
                Excel Analytics
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/upload"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/upload'
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Upload
              </Link>
            </div>
          </div>

          {/* Mobile menu button (hidden for now) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-white/20 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/dashboard'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/upload'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;