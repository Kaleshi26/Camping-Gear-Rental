// frontend/src/pages/SignUp.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for "Log In" link
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For show/hide password icon

// Import the coffee-pouring image (replace with the actual path to your asset)
import CoffeePouringImage from '../assets/images/coffee-pouring.jpg';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password
  const [showReEnterPassword, setShowReEnterPassword] = useState(false); // State for show/hide re-enter password
  const [emailError, setEmailError] = useState(''); // State for email validation message
  const [passwordError, setPasswordError] = useState(''); // State for password validation message
  const [termsAgreed, setTermsAgreed] = useState(false); // State for terms and conditions checkbox
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    // Client-side validation
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

    // Existing password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== reEnterPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if terms are agreed
    if (!termsAgreed) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to sign up. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9E5] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Left Side: Sign-Up Form */}
        <div className="md:w-1/2 w-full p-8 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create an account</h2>
          <p className="text-center text-gray-600 mb-6">Join for Exclusive Access!</p>

          {error && (
            <p className="text-red-500 text-center mb-4 animate-pulse">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                *Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all duration-300"
                required
              />
            </div>

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
                required
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
                  required
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
            </div>

            {/* Re-enter Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                *Re-enter Password
              </label>
              <div className="relative">
                <input
                  type={showReEnterPassword ? 'text' : 'password'}
                  value={reEnterPassword}
                  onChange={(e) => setReEnterPassword(e.target.value)}
                  placeholder="Re-enter your Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showReEnterPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="h-4 w-4 text-[#D4A017] border-gray-300 rounded focus:ring-[#D4A017]"
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree with the terms and conditions
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full bg-[#D4A017] text-white py-3 rounded-lg hover:bg-[#b88c14] transition-colors duration-300 transform hover:scale-105"
            >
              Create Account
            </button>
          </form>

          {/* Log In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-blue-600 hover:underline hover:text-blue-800 font-medium transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>

        {/* Right Side: Coffee Pouring Image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={CoffeePouringImage}
            alt="Coffee Pouring Scene"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;