import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'; // For icons
import { motion } from 'framer-motion';

// Import Assets
import ContactBackground from '../assets/images/camping-background9.jpg'; // Background image
import ContactSideImage from '../assets/images/contact-side-image.jpg'; // New 620x660 image

function Contact() {
  // Animation Variants (copied from Blog.jsx for consistency)
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="bg-[#FFF9E5] min-h-screen">
      {/* Header Section with Full-Width Blurred Background */}
      <section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${ContactBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.7)',
            WebkitFilter: 'blur(8px) brightness(0.7)',
            transform: 'scale(1.1)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.span
          className="relative text-4xl md:text-6xl font-bold text-white text-center px-4 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          CampEase Contact
        </motion.span>
      </section>

      {/* Contact Area */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
              {/* Contact Form */}
              <div className="lg:w-1/2 w-full p-8 bg-gradient-to-br from-white to-[#F5F5DC]">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-[#8B4513] mb-2 animate-slide-in-left">
                    Send Us A Message
                  </h2>
                  <p className="text-gray-600 animate-slide-in-left delay-100">
                    Your email address will not be published*
                  </p>
                </div>
                <form className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <div className="sm:w-1/2 w-full mb-4 sm:mb-0">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 transform hover:scale-105 bg-white shadow-sm"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="sm:w-1/2 w-full">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 transform hover:scale-105 bg-white shadow-sm"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      name="subject"
                      id="subject"
                      className="w-full px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 transform hover:scale-105 bg-white shadow-sm"
                    >
                      <option disabled selected hidden value="">
                        Select Subject
                      </option>
                      <option value="Forest">Forest</option>
                      <option value="Hill">Hill</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      name="message"
                      id="message"
                      className="w-full px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300 transform hover:scale-105 bg-white shadow-sm"
                      placeholder="Type Message"
                      rows="5"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-[#1A3C34] text-white py-3 px-6 rounded-lg hover:bg-[#2F4F4F] transition-colors duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Submit Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Image */}
              <div className="lg:w-1/2 w-full">
                <div className="bg-[#F5F5DC] h-[660px] flex items-center justify-center">
                  <img
                    src={ContactSideImage}
                    alt="Contact Side Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
            {/* Phone Number */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-[#8B4513] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-[#FFF9E5] hover:to-[#F5F5DC]">
              <div className="text-[#2F4F4F] text-5xl mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <FaPhoneAlt />
              </div>
              <h4 className="text-xl font-semibold text-[#8B4513] mb-4">
                Phone Number
              </h4>
              <div className="space-y-2">
                <a
                  href="tel:+880369525423"
                  className="block text-gray-600 hover:text-[#2F4F4F] transition-colors"
                >
                  (071) 3695 254
                </a>
                <a
                  href="tel:+880369525423"
                  className="block text-gray-600 hover:text-[#2F4F4F] transition-colors"
                >
                  (076) 3695 345
                </a>
              </div>
            </div>

            {/* Office Address */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-[#8B4513] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-[#FFF9E5] hover:to-[#F5F5DC]">
              <div className="text-[#2F4F4F] text-5xl mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <FaMapMarkerAlt />
              </div>
              <h4 className="text-xl font-semibold text-[#8B4513] mb-4">
                Office Address
              </h4>
              <span className="block text-gray-600">
                11/B5/10-1, 6th lane, off upper tank road 2,Hanthana
              </span>
            </div>

            {/* Email Address */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-[#8B4513] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-[#FFF9E5] hover:to-[#F5F5DC]">
              <div className="text-[#2F4F4F] text-5xl mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <FaEnvelope />
              </div>
              <h4 className="text-xl font-semibold text-[#8B4513] mb-4">
                Email Address
              </h4>
              <div className="space-y-2">
                <a
                  href="mailto:info@example.com"
                  className="block text-gray-600 hover:text-[#2F4F4F] transition-colors"
                >
                  EshanCampEase.com
                </a>
                <a
                  href="mailto:support@example.com"
                  className="block text-gray-600 hover:text-[#2F4F4F] transition-colors"
                >
                  Wesupport@CampEase.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Area (Larger) */}
      <div className="w-full">
        <div className="container-fluid px-0">
          <div className="w-full h-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37650.44932194224!2d80.60081137747865!3d7.2957759444957135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366266498acd3%3A0x411a3818a1e03c35!2sKandy!5e0!3m2!1sen!2slk!4v1743445957654!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Embed of Kandy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;