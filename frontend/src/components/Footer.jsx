// frontend/src/components/Footer.jsx
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import campEaseLogo from '../assets/camp-ease-logo.png'; // Replace with your actual logo path

function Footer() {
  return (
    <footer
      className="bg-green-900 text-white py-20"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23334d32" /%3E%3C/svg%3E')`, // Fallback SVG
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{ zIndex: 0 }}
      ></div>
      <div className="container mx-auto px-4 relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About CampEase */}
          <div>
            <h3
              className="text-2xl font-bold mb-2 transition-all duration-300 ease-in-out hover:text-green-400 hover:scale-105 cursor-pointer"
            >
              CampEase
            </h3>
            <img
              src={campEaseLogo}
              alt="CampEase Logo"
              className="w-40 h-auto mb-4 transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-6 cursor-pointer"
            />
            <p className="text-gray-300 text-lg">
              Your one-stop solution for renting camping gear. Explore the outdoors with ease and
              comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-lg">
              <li>
                <a href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/gear"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/offers"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Offers
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-300 text-lg">Email: Wesupport@campease.com</p>
            <p className="text-gray-300 text-lg">Phone: +94 778245334</p>
            <p className="text-gray-300 text-lg">Address: 123 doluwa Road, Hanthana, Kandy</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaFacebook size={28} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaTwitter size={28} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaInstagram size={28} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-300 text-lg">
          © {new Date().getFullYear()} CampEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;