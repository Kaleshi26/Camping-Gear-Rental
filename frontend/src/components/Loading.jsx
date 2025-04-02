// frontend/src/components/Loading.jsx
import React from 'react';

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      {/* Loading Container */}
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner with Camping Green Colors */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-transparent border-b-transparent border-l-green-700 border-r-lime-400 rounded-full animate-spin"></div>
          <div className="absolute inset-1 border-4 border-t-transparent border-b-transparent border-l-lime-400 border-r-green-700 rounded-full animate-spin-slow"></div>
        </div>

        {/* Loading Text with Pulse Animation */}
        <h2 className="text-2xl font-semibold text-lime-100 animate-pulse">
          Loading...
        </h2>

        {/* Subtle Tagline with Fade Animation */}
        <p className="text-sm text-green-200 animate-fade-in">
          Getting your gear ready!
        </p>
      </div>

      {/* Background Particles Effect with Camping Green Tones */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`particle particle-${i % 5} absolute w-2 h-2 rounded-full animate-particle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? '#15803d' : '#bef264', // Alternating green shades
            }}
          ></div>
        ))}
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        /* Spin animation for the outer spinner */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Slower spin for the inner spinner */
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 1.5s linear infinite;
        }

        /* Fade-in animation for the tagline */
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        /* Particle animation */
        @keyframes particleFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
        }
        .animate-particle {
          animation: particleFloat 3s ease-in-out infinite;
        }
        .particle-0 { animation-delay: 0s; }
        .particle-1 { animation-delay: 0.3s; }
        .particle-2 { animation-delay: 0.6s; }
        .particle-3 { animation-delay: 0.9s; }
        .particle-4 { animation-delay: 1.2s; }
      `}</style>
    </div>
  );
}

export default Loading;