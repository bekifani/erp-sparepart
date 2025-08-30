import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAutenticated = useSelector((state) => state.auth.isAuthenticated)
  const permissions = (useSelector((state) => state.auth.user?.permissions) || [])
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`z-[99999] fixed top-0 md:top-3 max-w-screen-xl mx-auto rounded-b-xl md:rounded-xl w-full transition-all duration-300 ${
      scrolled 
        ? 'translate-y-0 dark:bg-gray-900/75 bg-gray-100/75 backdrop-blur-md'
        : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:justify-around h-16">
          {/* Left Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Home
            </Link>
            <a href="#about" className="text-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              About
            </a>
            <Link to="/business-sectors" className="text-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Sectors
            </Link>
          </div>

          {/* Logo - Centered */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Right Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
          <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Contact
            </Link>

            {!isAutenticated ? (
            <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Register
          </Link>
          ) : (
            <Link to="/menu/my-account" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Account
          </Link>
          )}

  {!isAutenticated ? (
            <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Login
          </Link>
          ) : (
            <>
            {permissions.includes('view-my-company') ? (
              <Link to="/menu/my-company" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              My Company
            </Link>
            ) : (
              <Link to="/menu/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Dashboard
          </Link>
            )}
            </>
          )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu Icon */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden dark:bg-gray-900/75 bg-gray-100/75 backdrop-blur-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link to="/" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Home
          </Link>
          <a href="/#about" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            About
          </a>
          <Link to="/business-sectors" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Sectors
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Contact
          </Link>
          {!isAutenticated ? (
            <Link to="/register" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Register
          </Link>
          ) : (
            <Link to="/menu/my-account" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            My Account
          </Link>
          )}

{!isAutenticated ? (
            <Link to="/login" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Login
          </Link>
          ) : (
            <>
            {permissions.includes('view-my-company') ? (
              <Link to="/menu/my-company" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              My Company
            </Link>
            ) : (
              <Link to="/menu/dashboard" className="block px-3 py-2 rounded-md dark:text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Dashboard
          </Link>
            )}
            </>
          )}
          
          
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;