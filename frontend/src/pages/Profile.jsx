// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEdit, FaCampground, FaSignOutAlt, FaStar } from 'react-icons/fa';

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg6.jpg';

function Profile() {
  const { isAuthenticated, role, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || role !== 'customer') {
      setError('You must be logged in as a customer to view this page.');
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, role, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const productCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9E5]">
        <p className="text-lg text-[#8B4513] animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9E5]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 bg-[#F5F5DC] rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-6xl text-[#2F4F4F] mb-4" />
            <h2 className="text-2xl font-bold text-[#8B4513]">{profile.name}</h2>
            <p className="text-[#8B4513]">Happy Camper</p>
            <p className="text-[#8B4513] mt-2 flex items-center">
              <FaStar className="mr-2 text-[#1A3C34]" /> Loyalty Points: {profile.loyaltyPoints}
            </p>
          </div>
          <nav className="space-y-4">
            <Link
              to="#personal-info"
              className="block text-[#8B4513] hover:text-[#2F4F4F] transition-colors font-medium"
            >
              Personal Info
            </Link>
            <Link
              to="#rented-products"
              className="block text-[#8B4513] hover:text-[#2F4F4F] transition-colors font-medium"
            >
              Rented Products
            </Link>
            <Link
              to="#payments"
              className="block text-[#8B4513] hover:text-[#2F4F4F] transition-colors font-medium"
            >
              Payments
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center space-x-2 bg-[#1A3C34] text-white py-2 rounded-lg hover:bg-[#2F4F4F] transition-colors"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </aside>

        <main className="md:w-3/4 space-y-8">
          <motion.section
            id="personal-info"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#F5F5DC] rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#8B4513] flex items-center">
                <FaUserCircle className="mr-2 text-[#1A3C34]" /> Personal Information
              </h3>
              <button
                onClick={() => alert('Edit Profile functionality coming soon!')}
                className="flex items-center space-x-2 text-[#1A3C34] hover:text-[#2F4F4F] font-medium"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-[#8B4513]">
                <strong className="text-[#1A3C34]">Name:</strong> {profile.name}
              </p>
              <p className="text-[#8B4513]">
                <strong className="text-[#1A3C34]">Email:</strong> {profile.email}
              </p>
            </div>
          </motion.section>

          <motion.section
            id="rented-products"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#F5F5DC] rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-[#8B4513] mb-6 flex items-center">
              <FaCampground className="mr-2 text-[#1A3C34]" /> Rented Products
            </h3>
            {profile.rentedProducts.length === 0 ? (
              <p className="text-[#8B4513] text-center">You have not rented any products yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.rentedProducts.map((item, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={productCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="bg-white rounded-lg shadow-md p-4 border border-[#8B4513] hover:border-[#2F4F4F] transition-colors"
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                    <h4 className="text-lg font-semibold text-[#8B4513]">{item.name}</h4>
                    <p className="text-[#8B4513]">Price: Rs{item.price} / unit</p>
                    <p className="text-[#8B4513]">Quantity: {item.quantity}</p>
                    <p className="text-[#8B4513]">
                      Rented on: {new Date(item.rentedAt).toLocaleDateString()}
                    </p>
                    <p className="text-[#1A3C34] font-semibold mt-2">
                      Total: Rs{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            id="payments"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#F5F5DC] rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-[#8B4513] mb-6 flex items-center">
              <FaCampground className="mr-2 text-[#1A3C34]" /> My Payments
            </h3>
            {profile.payments.length === 0 ? (
              <p className="text-[#8B4513] text-center">You have not made any payments yet.</p>
            ) : (
              <div className="space-y-6">
                {profile.payments.map((payment, paymentIndex) => (
                  <div
                    key={paymentIndex}
                    className="bg-white rounded-lg shadow-md p-4 border border-[#8B4513]"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-[#8B4513]">
                        Payment on {new Date(payment.paymentDate).toLocaleDateString()}
                      </h4>
                      <p className="text-[#1A3C34] font-semibold">
                        Total: Rs{payment.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    {payment.discountApplied > 0 && (
                      <p className="text-green-600 mb-4">
                        Discount Applied: {payment.discountApplied}% (Loyalty Discount)
                      </p>
                    )}
                    {payment.refunded && (
                      <p className="text-red-500 mb-4">
                        Refunded on {new Date(payment.refundDate).toLocaleDateString()} - Reason: {payment.refundReason}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {payment.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          custom={itemIndex}
                          variants={productCardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          className="bg-[#F5F5DC] rounded-lg shadow-sm p-3 border border-[#8B4513] hover:border-[#2F4F4F] transition-colors"
                        >
                          <img
                            src={item.image || 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                          />
                          <h5 className="text-md font-semibold text-[#8B4513]">{item.name}</h5>
                          <p className="text-[#8B4513]">Price: Rs{item.price} / unit</p>
                          <p className="text-[#8B4513]">Quantity: {item.quantity}</p>
                          <p className="text-[#8B4513]">
                            Subtotal: Rs{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </div>
  );
}

export default Profile;