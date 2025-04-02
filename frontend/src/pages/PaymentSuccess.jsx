// frontend/src/pages/PaymentSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

// Import the video wallpaper (adjust the path based on your asset location)
import paymentSuccessVideo from '../assets/payment-success-bg1.mp4';

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const confirmPayment = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      if (sessionId) {
        try {
          // Confirm the payment
          await api.post('/payment/confirm-payment', { sessionId });
          // Clear the cart after successful payment
          await api.delete('/cart/clear');
        } catch (err) {
          console.error('Error confirming payment or clearing cart:', err);
        }
      }
    };

    confirmPayment();

    // Redirect to profile after 3 seconds
    setTimeout(() => {
      navigate('/profile');
    }, 3000);
  }, [navigate, location]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={paymentSuccessVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video background for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto p-6 max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Popup Congratulatory Text with Animation */}
          <h2 className="text-4xl font-extrabold text-white mb-4 animate-bounce text-center">
            🎉 Payment Successful!
          </h2>
          <p className="text-lg text-gray-200 text-center animate-fade-in">
            Thank you for your purchase! You’re all set to enjoy your gear. Redirecting to your profile...
          </p>

          {/* Progress Bar for Redirect */}
          <div className="mt-6">
            <div className="w-full bg-gray-300/30 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full animate-progress"
                style={{ width: '100%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">Redirecting in 3 seconds...</p>
          </div>
        </div>

        {/* Confetti Effect (using CSS animation) */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`confetti confetti-${i % 5} absolute w-3 h-3 rounded-full animate-confetti`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        /* Fade-in animation for the text */
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        /* Progress bar animation for redirect */
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }

        /* Confetti animation */
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confettiFall 5s linear infinite;
        }
        .confetti-0 { animation-delay: 0s; }
        .confetti-1 { animation-delay: 0.5s; }
        .confetti-2 { animation-delay: 1s; }
        .confetti-3 { animation-delay: 1.5s; }
        .confetti-4 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

export default PaymentSuccess;