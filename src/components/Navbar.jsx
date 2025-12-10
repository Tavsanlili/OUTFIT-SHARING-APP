import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // --- DEĞİŞİKLİK BURADA YAPILDI ---
    // Senin tasarım kodlarının başına 'fixed top-0 left-0 w-full z-50' eklendi.
    // Bu sayede menü en üste yapışacak ve sağa taşma yapmayacak.
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <span className="text-2xl"></span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Sharing APP
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-600 px-5 py-2 rounded-full hover:bg-yellow-200 hover:text-purple-700 transition-all duration-300 font-bold shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-purple-700 border-t border-purple-400">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/"
              className="block text-white hover:text-yellow-200 py-2 font-medium"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-white hover:text-yellow-200 py-2 font-medium"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            <div className="pt-3 space-y-2">
              <Link
                to="/login"
                className="block text-center text-white border-2 border-white px-5 py-2 rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300 font-medium"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center bg-white text-purple-600 px-5 py-2 rounded-full hover:bg-yellow-200 hover:text-purple-700 transition-all duration-300 font-bold"
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;