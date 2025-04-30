// frontend/src/pages/ForgotPassword.jsx
import { Link } from 'react-router-dom';

// Import the character image (replace with the actual path to your asset)
import ForgotPasswordCharacter from '../assets/images/forgot-password-character.jpg';

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9E5] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Left Side: Character Image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src={ForgotPasswordCharacter}
            alt="Forgot Password Character"
            className="w-full h-full object-contain p-8"
          />
        </div>

        {/* Right Side: Forgot Password Form */}
        <div className="md:w-1/2 w-full p-8 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password</h2>
          <p className="text-center text-gray-600 mb-6">Reset your password using your email</p>

          <form className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                *Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017] transition-all duration-300"
              />
            </div>

            {/* Send Reset Link Button */}
            <button
              type="submit"
              className="w-full bg-[#D4A017] text-white py-3 rounded-lg hover:bg-[#b88c14] transition-colors duration-300 transform hover:scale-105"
            >
              Send Reset Link
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Did you remember the password?{' '}
            <Link
              to="/signin"
              className="text-blue-600 hover:underline hover:text-blue-800 font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;