import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NavigationBarSecondary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAutenticated = useSelector((state) => state.auth.isAuthenticated)
  const permissions = (useSelector((state) => state.auth.user?.permissions) || [])

  return (
    <div className='w-full flex  justify-between md:justify-center items-center'>
    <nav className={`z-[99999] fixed top-0 md:top-3 max-w-screen-xl  rounded-none md:rounded-xl w-full transition-all duration-300 dark:bg-gray-900/75 bg-gray-700/75 backdrop-blur-md mx-auto`}>
      <div className="max-w-screen-xl mx-auto px-2 lg:px-8">
        <div className="flex justify-between  md:justify-around h-16 w-full text-white">
          {/* Left Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-md text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Home
            </Link>
            <a href="#about" className="text-md text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              About
            </a>
            <Link to="/business-sectors" className="text-md text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Sectors
            </Link>
          </div>

          {/* Logo - Centered */}
          <div className="flex-shrink-0 flex items-center md:hidden">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Logo"
              />
            </Link>
          </div>
         
          <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] md:w-[30%] h-16 md:h-24">
          <div 
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
              borderRadius: '25px',
              width: '100%',
              height: '100%',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            className='bg-gray-100 dark:bg-gray-800 rounded-xl'
          >
            <div className='w-full h-16 md:h-24 flex justify-center items-center pt-4 md:pt-8'>
            <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Logo"
              />
            </Link>
          </div>
            </div>
          </div>
        </div>

          {/* Right Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
          <Link to="/contact" className="text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Contact
            </Link>
          {!isAutenticated ? (
            <Link to="/register" className="text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Register
          </Link>
          ) : (
            <Link to="/menu/my-account" className="text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Account
          </Link>
          )}

          

          {!isAutenticated ? (
            <Link to="/login" className="text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Login
          </Link>
          ) : (
            <>
            {permissions.includes('view-my-company') ? (
              <Link to="/menu/my-company" className="text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
              Company
            </Link>
            ) : (
              <Link to="/menu/dashboard" className="text-white dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
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
              className="inline-flex items-center justify-center p-2 rounded-md text-white font-md hover:text-gray-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
              Company
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
    </div>
  );
};

export default NavigationBarSecondary;