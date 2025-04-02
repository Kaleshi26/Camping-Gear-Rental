// frontend/src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import stripePromise from '../utils/stripe';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCampground, FaFire, FaTimes } from 'react-icons/fa';

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg9.jpg'; // Adjust the path if necessary

function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [shippingCost, setShippingCost] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (location.state && location.state.cart && location.state.total && !authLoading) {
      setCartItems(location.state.cart);
      setTotal(location.state.total);
      setLoading(false);
    } else {
      navigate('/cart');
    }

    if (!user) {
      navigate('/signin');
    }
  }, [location, authLoading, navigate, user]);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountedTotal = subtotal - (subtotal * discount) / 100;
    return discountedTotal + shippingCost;
  };

  const handlePromoCode = () => {
    if (promoCode.toUpperCase() === 'CAMP10') {
      setDiscount(10);
    } else {
      setDiscount(0);
      alert('Invalid promo code');
    }
  };

  const handleShippingMethod = (method) => {
    setShippingMethod(method);
    if (method === 'Standard') {
      setShippingCost(0);
    } else if (method === 'Express') {
      setShippingCost(15);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Full Name is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.postalCode) errors.postalCode = 'Postal Code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!stripe) return;

    setProcessing(true);
    try {
      const response = await api.post('/payment/create-checkout-session', {
        cartItems: cartItems,
        userId: user.id || 'guest', // Replace with actual user ID if available
      });

      const sessionId = response.data.id;

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      }
    } catch (err) {
      setError('Failed to initiate checkout');
      setProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading || authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${campingBg})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <p className="text-lg text-[#F5F5DC] animate-pulse z-10">Loading checkout...</p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${campingBg})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="text-center bg-[#F5F5DC]/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl">
          <p className="text-base sm:text-lg text-gray-800 mb-4">
            No items in cart to checkout.
          </p>
          <Link
            to="/gear"
            className="inline-flex items-center space-x-2 bg-green-800 text-white py-2 px-6 rounded-lg hover:bg-green-900 transition-all duration-300 transform hover:scale-105 shadow-md animate-pulse-glow text-sm sm:text-base"
          >
            <FaFire className="text-lg sm:text-xl" />
            <span>Start Shopping</span>
          </Link>
        </div>
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
        {/* Checkout Header */}
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
            Checkout
          </h2>
          <p className="text-[#F5F5DC]/80 mt-2 text-sm sm:text-base">
            Finalize your camping adventure with CampEase!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Shipping Address and Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#F5F5DC]/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-[#8B4513]"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-4 sm:mb-6 flex items-center">
              <FaCampground className="mr-2 text-[#2F4F4F] text-lg sm:text-xl" /> Shipping Address
            </h3>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 text-sm sm:text-base"
                />
                {formErrors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 text-sm sm:text-base"
                />
                {formErrors.address && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 text-sm sm:text-base"
                  />
                  {formErrors.city && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 text-sm sm:text-base"
                  />
                  {formErrors.postalCode && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mt-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-4 flex items-center">
                  <FaCampground className="mr-2 text-[#2F4F4F] text-lg sm:text-xl" /> Payment Method
                </h3>
                <div className="space-y-2">
                  {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                    <label key={method} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        defaultChecked={method === 'Credit Card'}
                        className="text-[#2F4F4F] focus:ring-[#2F4F4F]"
                      />
                      <span className="text-gray-800 text-sm sm:text-base">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping Method Selection */}
              <div className="mt-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-4 flex items-center">
                  <FaCampground className="mr-2 text-[#2F4F4F] text-lg sm:text-xl" /> Shipping Method
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="Standard"
                      checked={shippingMethod === 'Standard'}
                      onChange={() => handleShippingMethod('Standard')}
                      className="text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <span className="text-gray-800 text-sm sm:text-base">Standard (Free)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="Express"
                      checked={shippingMethod === 'Express'}
                      onChange={() => handleShippingMethod('Express')}
                      className="text-[#2F4F4F] focus:ring-[#2F4F4F]"
                    />
                    <span className="text-gray-800 text-sm sm:text-base">Express (Rs15.00)</span>
                  </label>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 bg-[#F5F5DC]/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl border border-[#8B4513]"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-4 sm:mb-6 flex items-center">
              <FaCampground className="mr-2 text-[#2F4F4F] text-lg sm:text-xl" /> Order Summary
            </h3>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.productId}
                  custom={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.image || 'https://placehold.co/150x150'}
                    alt={item.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border border-[#2F4F4F] shadow-md"
                    onError={(e) => (e.target.src = 'https://placehold.co/150x150?text=Image+Not+Found')}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Rs{item.price} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#2F4F4F]">
                    Rs{(item.price * item.quantity).toFixed(2)}
                  </p>
                </motion.div>
              ))}
              <div className="border-t border-[#8B4513] pt-4 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-lg text-gray-800">
                  <span>Subtotal:</span>
                  <span>Rs{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-lg text-gray-800">
                  <span>Discount ({discount}%):</span>
                  <span>-Rs{(calculateSubtotal() * discount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-lg text-gray-800">
                  <span>Shipping ({shippingMethod}):</span>
                  <span>Rs{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-xl font-semibold text-[#8B4513]">
                  <span>Total:</span>
                  <span>Rs{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              {/* Promo Code Input */}
              <div className="mt-4">
                <h4 className="text-sm sm:text-base font-semibold text-[#8B4513] mb-2">Promo Code</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (e.g., CAMP10)"
                    className="flex-1 px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 text-sm sm:text-base"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#6F3A0F] transition-all duration-300 text-sm sm:text-base"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={processing || !stripe}
                className="w-full bg-green-800 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-green-900 transition-all duration-300 transform hover:scale-105 shadow-md animate-pulse-glow mt-4 text-sm sm:text-base disabled:bg-gray-400"
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
              {error && <p className="text-red-500 mt-4 text-sm sm:text-base">{error}</p>}
            </div>
          </motion.div>
        </div>

        {/* Minimal Footer */}
        <footer className="bg-[#2F4F4F]/80 backdrop-blur-md text-white p-4 text-center mt-8">
          <p className="text-sm sm:text-base">© 2025 CampEase. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
}