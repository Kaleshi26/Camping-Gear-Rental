// frontend/src/pages/SignIn.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For show/hide password icon

// Import the camping image (replace with the actual path to your asset)
import CampingImage from '../assets/images/camping-image.jpg';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password
  const [emailError, setEmailError] = useState(''); // State for email validation message
  const [passwordError, setPasswordError] = useState(''); // State for password validation message
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    // Basic client-side validation
    let hasError = false;
    if (!email) {
      setEmailError('Please enter your Email!');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Please enter your Password!');
      hasError = true;
    }

    if (hasError) return;

    try {
      const role = await login(email, password);
      switch (role) {
        case 'customer':
          navigate('/profile');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'inventory_manager':
          navigate('/inventory-dashboard');
          break;
        case 'finance_manager':
          navigate('/finance-dashboard');
          break;
        case 'rental_manager':
          navigate('/rental-dashboard');
          break;
        case 'marketing_manager':
          navigate('/marketing-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9E5] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Left Side: Camping Image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={CampingImage}
            alt="Camping Scene"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Sign-In Form */}
        <div className="md:w-1/2 w-full p-8 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Log In</h2>
          <p className="text-center text-gray-600 mb-6">Unlock your World!</p>

          {error && (
            <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                *Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(''); // Clear error on change
                }}
                placeholder="Enter your Email"
                className={`w-full px-4 py-3 border ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all duration-300`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1 animate-bounce">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                *Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(''); // Clear error on change
                  }}
                  placeholder="Enter your Password"
                  className={`w-full px-4 py-3 border ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all duration-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 animate-bounce">
                  {passwordError}
                </p>
              )}
              {/* Forgot Password Link */}
              <p className="text-right text-sm text-gray-600 mt-2">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#D4A017] text-white py-3 rounded-lg hover:bg-[#b88c14] transition-colors duration-300 transform hover:scale-105"
            >
              Sign in
            </button>
          </form>

          {/* Create Account Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account yet?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline hover:text-blue-800 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;