// frontend/src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCampground, FaFire } from 'react-icons/fa';

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg8.jpg'; // Adjust the path if necessary

function Cart() {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems !== undefined && !authLoading) {
      setLoading(false);
    }
  }, [cartItems, authLoading]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/signin');
    } else {
      navigate('/checkout', { state: { cart: cartItems, total: calculateTotal() } });
    }
  };

  // Fallback image URL if the placeholder fails
  const fallbackImage = 'https://placehold.co/150x150?text=Image+Not+Found';

  if (loading || authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${campingBg})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <p className="text-lg text-[#F5F5DC] animate-pulse z-10">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${campingBg})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Cart Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex justify-center mb-4">
            <FaCampground className="text-5xl sm:text-6xl text-[#2F4F4F] animate-pulse-glow" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F5DC] tracking-wide">
            Your Camping Cart
          </h2>
          <p className="text-[#F5F5DC]/80 mt-2 text-sm sm:text-base">
            Gear up for your next adventure with CampEase!
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-[#F5F5DC]/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl"
          >
            <div className="flex justify-center mb-4">
              <FaCampground className="text-5xl sm:text-6xl text-[#8B4513] animate-bounce-in" />
            </div>
            <p className="text-base sm:text-lg text-gray-800 mb-4">
              Your cart is empty, just like an unlit campfire.
            </p>
            <Link
              to="/gear"
              className="inline-flex items-center space-x-2 bg-green-800 text-white py-2 px-6 rounded-lg hover:bg-green-900 transition-all duration-300 transform hover:scale-105 shadow-md animate-pulse-glow text-sm sm:text-base"
            >
              <FaFire className="text-lg sm:text-xl" />
              <span>Start Shopping</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.productId}
                  custom={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-[#F5F5DC]/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-[#8B4513] hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <img
                        src={item.image || 'https://placehold.co/150x150'}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-[#2F4F4F] shadow-md"
                        onError={(e) => (e.target.src = fallbackImage)} // Updated fallback
                      />
                      <div className="text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Rs{item.price} / unit</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-2 sm:space-x-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="bg-[#8B4513] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-[#6F3A0F] transition-colors duration-300 text-sm sm:text-base"
                        >
                          -
                        </button>
                        <span className="relative inline-block px-3 sm:px-4 py-1 bg-[#2F4F4F] text-[#F5F5DC] rounded-full font-semibold text-sm sm:text-base">
                          {item.quantity}
                          <FaCampground className="absolute -top-2 -right-2 text-[#F5F5DC] text-lg sm:text-xl" />
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="bg-[#8B4513] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-[#6F3A0F] transition-colors duration-300 text-sm sm:text-base"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-[#2F4F4F]">
                        Rs{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-[#8B4513] hover:text-red-600 transition-colors duration-300 group"
                      >
                        <FaFire className="text-lg sm:text-xl group-hover:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 bg-[#F5F5DC]/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-[#8B4513]"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-4 sm:mb-6 flex items-center">
                <FaCampground className="mr-2 text-[#2F4F4F] text-lg sm:text-xl" /> Cart Totals
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-lg text-gray-800">
                  <span>Subtotal:</span>
                  <span>Rs{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-lg text-gray-800">
                  <span>Shipping:</span>
                  <span className="text-[#2F4F4F] font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-base sm:text-xl font-semibold text-[#8B4513] border-t border-[#8B4513] pt-3 sm:pt-4">
                  <span>Total:</span>
                  <span>Rs{calculateTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-green-800 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-green-900 transition-all duration-300 transform hover:scale-105 shadow-md animate-pulse-glow mt-4 text-sm sm:text-base"
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* You May Be Interested In Section */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-12 bg-[#F5F5DC]/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-4 sm:mb-6 flex items-center">
              <FaCampground className="mr-2 text-[#2F4F4F] text-lg sm:text-xl" /> You May Be Interested In
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { name: 'Camping Tent', price: 1200.00, image: 'https://s.alicdn.com/@sc04/kf/H5fed7241ddb14355a21df9ead713160aW.jpg_720x720q50.jpg' },
                { name: 'Portable Stove', price: 455.00, image: 'https://s.alicdn.com/@sc04/kf/H7897ffe8c0c145ff891154a83ba0c85fz.jpg_720x720q50.jpg' },
                { name: 'Hiking Backpack', price: 250.00, image: 'https://s.alicdn.com/@sc04/kf/H9ad034eadc3a4a1da2b1ce8abda83ed1F.jpg_720x720q50.jpg' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#8B4513]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-md mb-4"
                    onError={(e) => (e.target.src = fallbackImage)} // Updated fallback
                  />
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-[#2F4F4F] font-semibold text-sm sm:text-base">Rs{item.price.toFixed(2)}</p>
                  <button className="mt-2 w-full bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-900 transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base">
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        
      </div>
    </div>
  );
}

export default Cart;