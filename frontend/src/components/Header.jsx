import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Adjust based on your actual logo filename

function Header() {
  const { isAuthenticated, role } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the current page is the home page
  const isHomePage = location.pathname === '/';

  // Handle scroll to change header visibility and background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      setIsScrolled(false); // Start hidden on home page
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true); // Always visible on non-home pages
    }
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/gear' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/aboutus' },
    { name: 'Blog', path: '/blog' },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const linkVariants = {
    hover: { scale: 1.1, color: '#D2B48C', transition: { duration: 0.2 } },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#1A3C34] shadow-lg opacity-100' : isHomePage ? 'bg-transparent opacity-0' : 'bg-[#1A3C34] opacity-100'
        } py-4 md:py-6 backdrop-filter backdrop-blur-md`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo and Website Name */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            {/* Logo */}
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={logo}
                alt="CampEase Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            {/* Enhanced CampEase Name with Camping Theme */}
            <motion.span
              className={`text-2xl md:text-4xl font-extrabold ${
                isScrolled ? 'text-white' : ''
              }`}
              style={{ fontFamily: "'Protest Riot', sans-serif" }}
              animate={{
                textShadow: [
                  '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  '4px 4px 6px rgba(139, 69, 19, 0.5)',
                  '2px 2px 4px rgba(0, 0, 0, 0.3)'
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-[#2F4F4F]">C</span>
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                <span className="text-[#8B4513]">a</span>
              </motion.span>
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <span className="text-[#FF4500]">m</span>
              </motion.span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                <span className="text-[#87CEEB]">p</span>
              </motion.span>
              <span className="text-[#2F4F4F]">E</span>
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <span className="text-[#8B4513]">a</span>
              </motion.span>
              <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity }}>
                <span className="text-[#FF4500]">s</span>
              </motion.span>
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
                <span className="text-[#87CEEB]">e</span>
              </motion.span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <motion.div key={link.name} whileHover="hover" variants={linkVariants}>
                <Link
                  to={link.path}
                  className={`${
                    isScrolled ? 'text-white' : 'text-[#8B4513]'
                  } hover:text-[#D2B48C] transition-colors animate-pulse-once`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side: Search, Sign In, Cart, Profile, Menu Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Bar (Hidden on mobile by default, shown in mobile menu) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/80 backdrop-blur-sm w-32 md:w-40"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513] animate-bounce" />
            </div>

            {/* Sign In (only shown when not authenticated) */}
            {!isAuthenticated && (
              <Link
                to="/signin"
                className={`flex items-center space-x-1 md:space-x-2 ${
                  isScrolled ? 'text-white' : 'text-[#8B4513]'
                } hover:text-[#D2B48C] transition-colors animate-fade-in text-sm md:text-base`}
              >
                <FaUser />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`flex items-center space-x-1 md:space-x-2 ${
                isScrolled ? 'text-white' : 'text-[#8B4513]'
              } hover:text-[#D2B48C] transition-colors animate-fade-in text-sm md:text-base`}
            >
              <FaShoppingCart />
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Profile Icon (Visible after Sign-In) */}
            {isAuthenticated && role === 'customer' && (
              <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                <Link to="/profile">
                  <FaUserCircle
                    className={`text-xl md:text-2xl ${
                      isScrolled ? 'text-white' : 'text-[#8B4513]'
                    } hover:text-[#D2B48C] animate-spin-slow`}
                  />
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="text-2xl focus:outline-none text-[#8B4513] md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className={isScrolled ? 'text-white' : 'text-[#8B4513]'} />
              ) : (
                <FaBars className={isScrolled ? 'text-white' : 'text-[#8B4513]'} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden bg-[#1A3C34] shadow-md px-4 py-6 absolute top-full left-0 w-full"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block py-3 text-white hover:text-[#D2B48C] transition-colors text-lg font-medium border-b border-[#2F4F4F]/20 last:border-b-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {/* Mobile Search Bar */}
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/80 backdrop-blur-sm"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513] animate-bounce" />
                </div>
              </div>
              {/* Mobile Sign In (if not authenticated) */}
              {!isAuthenticated && (
                <Link
                  to="/signin"
                  className="block py-3 text-white hover:text-[#D2B48C] transition-colors text-lg font-medium border-t border-[#2F4F4F]/20 mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer div to prevent content overlap on non-home pages */}
      {!isHomePage && <div className="h-20 md:h-24"></div>}
    </>
  );
}

export default Header;