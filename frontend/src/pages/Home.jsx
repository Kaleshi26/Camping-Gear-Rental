import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaCampground, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import Videos
import CampfireNightVideo from '../assets/videos/campfire-night.mp4';
import MountainHikingVideo from '../assets/videos/mountain-hiking.mp4';
import LakeCampingVideo from '../assets/videos/lake-camping.mp4';

// Import Images
import GearQualityImage from '../assets/images/gear-quality.jpg';
import FlexibleRentalsImage from '../assets/images/flexible-rentals.jpg';
import HassleFreeImage from '../assets/images/hassle-free.jpg';
import Review1Image from '../assets/images/review1.jpg';
import Review2Image from '../assets/images/review2.jpg';
import Review3Image from '../assets/images/review3.jpg';
import PremiumTentImage from '../assets/images/premium-tent.jpg';
import CampingStoveImage from '../assets/images/camping-stove.jpg';
import SleepingBagImage from '../assets/images/sleeping-bag.jpg';
import CampsiteTipImage from '../assets/images/campsite-tip.jpg';
import PackLightImage from '../assets/images/pack-light.jpg';
import StaySafeImage from '../assets/images/stay-safe.jpg';
import YalaNationalParkImage from '../assets/images/yala-national-park.jpg';
import EllaMountainsImage from '../assets/images/ella-mountains.jpg';
import WilpattuNationalParkImage from '../assets/images/wilpattu-national-park.jpg';
import WhyRentWallpaper from '../assets/images/why-rent-wallpaper.jpg';
import NewsletterWallpaper from '../assets/images/newsletter-wallpaper.jpg';
import ProtectGearImage from '../assets/images/ProtectGearImage.jpg';

function Home() {
  const videos = [
    { src: CampfireNightVideo, text: 'Experience the Magic of Camping with CampEase' },
    { src: MountainHikingVideo, text: 'Rent Gear for Your Next Adventure' },
    { src: LakeCampingVideo, text: 'Affordable Rentals, Unforgettable Experiences' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentWhySlide, setCurrentWhySlide] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    }, 5000);

    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => console.error('Video playback error:', error));
    }

    return () => clearInterval(interval);
  }, [currentSlide, videos.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? videos.length - 1 : prev - 1));

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/gear' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/aboutus' },
  ];

  const whyRentSlides = [
    { icon: <FaCampground className="text-6xl text-[#8B4513]" />, title: '100% Gear Quality', description: 'We offer top-quality camping gear to ensure your safety and comfort.', image: GearQualityImage },
    { icon: <FaMapMarkerAlt className="text-6xl text-[#8B4513]" />, title: 'Flexible Rentals', description: 'Need to change your rental dates? We’ve got you covered with easy adjustments.', image: FlexibleRentalsImage },
    { icon: <FaStar className="text-6xl text-[#8B4513]" />, title: 'Hassle-Free Experience', description: 'Rent online, pick up your gear, and enjoy your trip with zero stress.', image: HassleFreeImage },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWhySlide((prev) => (prev === whyRentSlides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [whyRentSlides.length]);

  const featuredGear = [
    { name: 'Premium Tent', image: PremiumTentImage, price: 1500 },
    { name: 'Camping Stove', image: CampingStoveImage, price: 830 },
    { name: 'Sleeping Bag', image: SleepingBagImage, price: 620 },
  ];

  const campingTips = [
    { title: 'Choose the Right Campsite', description: 'Look for flat ground, shade, and proximity to water sources.', image: CampsiteTipImage },
    { title: 'Pack Light but Smart', description: 'Bring multi-use items and avoid overpacking.', image: PackLightImage },
    { title: 'Stay Safe', description: 'Always let someone know your plans and carry a first-aid kit.', image: StaySafeImage },
  ];

  const destinations = [
    { name: 'Bellwood', description: 'Moragolla,KANDY', image: YalaNationalParkImage },
    { name: 'Ella Mountains', description: '3HR DRIVE FROM KANDY', image: EllaMountainsImage },
    { name: 'Wilpattu National Park', description: '1HR 30MIN DRIVE FROM ANURADHAPURA', image: WilpattuNationalParkImage },
  ];

  return (
    <div className="min-h-screen">
      {/* Simplified Video Slideshow Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white text-center mb-6">
            {videos[currentSlide].text}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
              onError={(e) => console.error('Video failed to load:', e)}
            >
              <source src={videos[currentSlide].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </h1>
          {!isScrolled && (
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white text-base sm:text-lg font-semibold hover:text-[#2F4F4F] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
          <div className="absolute bottom-6 sm:bottom-10 bg-[#F5F5DC]/80 p-3 sm:p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-3 sm:space-x-4 w-full max-w-3xl mx-4">
            <select className="p-2 border rounded-lg border-[#8B4513] w-full sm:w-auto">
              <option>Select Gear</option>
              <option>Tent</option>
              <option>Sleeping Bag</option>
              <option>Camping Stove</option>
            </select>
            <input type="date" defaultValue="2025-03-31" className="p-2 border rounded-lg border-[#8B4513] w-full sm:w-auto" />
            <input type="date" defaultValue="2025-04-01" className="p-2 border rounded-lg border-[#8B4513] w-full sm:w-auto" />
            <select className="p-2 border rounded-lg border-[#8B4513] w-full sm:w-auto">
              <option>Nationality</option>
              <option>Indian</option>
              <option>Sri Lankan</option>
              <option>Other</option>
            </select>
            
            <button
              onClick={() => navigate('/gear')}
              className="bg-[#1A3C34] text-white py-2 px-4 rounded-lg hover:bg-[#2F4F4F] w-full sm:w-auto"
            >
              Rent Now
            </button>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 sm:p-3 rounded-full hover:bg-opacity-75"
          >
            <FaArrowLeft className="text-[#8B4513]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 sm:p-3 rounded-full hover:bg-opacity-75"
          >
            <FaArrowRight className="text-[#8B4513]" />
          </button>
          <div className="absolute bottom-16 sm:bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === currentSlide ? 'bg-[#1A3C34]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Merged Introduction and Why Rent Section */}
      <div className="relative bg-gradient-to-b from-[#FFF9E5] via-[#F5F0D5] to-[#1A3C34] py-16">
        {/* Introduction Section */}
        <section className="relative z-10">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-[#8B4513] mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              CampEase Rentals and Reservations
            </motion.h2>
            <motion.p
              className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 font-serif italic leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="text-[#8B4513]">At CampEase</span>, we’re passionate about making your outdoor adventures unforgettable. Whether you’re a seasoned camper or a first-timer, we provide top-quality gear and seamless rental services to ensure you can focus on what matters most—creating memories in the heart of nature.
            </motion.p>
          </div>
        </section>

        {/* Updated How It Works Section with Animated Circles */}
        <section className="relative z-10 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-[#8B4513] mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              How It Works
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full border-2 border-dashed border-[#8B4513] flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaMapMarkerAlt className="text-4xl text-[#8B4513]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Choose Destination</h3>
                <p className="text-gray-600">
                  Pick your perfect camping spot—whether it’s a serene lake or a rugged mountain trail, we’ve got the gear for every adventure.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full border-2 border-dashed border-[#8B4513] flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaCampground className="text-4xl text-[#8B4513]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Make An Appointment</h3>
                <p className="text-gray-600">
                  Book your camping gear rental with ease—select your dates, choose your equipment, and we’ll have everything ready for you.
                </p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full border-2 border-dashed border-[#8B4513] flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaStar className="text-4xl text-[#8B4513]" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Enjoy Adventure</h3>
                <p className="text-gray-600">
                  Hit the trails with confidence—our high-quality gear ensures you can focus on the fun, not the hassle, of your camping trip.
                </p>
              </motion.div>
            </div>
            <div className="mt-8 border-t border-[#8B4513] opacity-50"></div>
          </div>
        </section>

        {/* Why Rent from Us Section */}
        <section className="relative z-10 py-16">
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-sm"
            style={{ backgroundImage: `url(${WhyRentWallpaper})`, opacity: 0.3 }}
          />
          <div className="container mx-auto px-4 text-center relative z-10 text-[#8B4513]">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 animate-fade-in">Why Rent from Us</h2>
            <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
              {whyRentSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentWhySlide ? 'opacity-100' : 'opacity-0'
                  } flex flex-col sm:flex-row items-center justify-center gap-6 sm:space-x-12`}
                >
                  <motion.div
                    className="w-full sm:w-1/2"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg shadow-2xl"
                      loading="lazy"
                    />
                  </motion.div>
                  <motion.div
                    className="w-full sm:w-1/2 text-center sm:text-left"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {slide.icon}
                    <h3 className="text-2xl sm:text-4xl font-semibold mt-4">{slide.title}</h3>
                    <p className="mt-4 text-base sm:text-lg">{slide.description}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Guest Reviews Section - Horizontal */}
      <section className="py-16 bg-[#F9F5E0]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#8B4513] mb-6 text-center">Guest Reviews</h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {[
              {
                review: 'Renting camping gear from CampEase was a game-changer for our family trip. The equipment was top-notch, and the process was seamless!',
                name: 'Heshan Silva',
                location: 'Gampola',
                image: Review1Image,
              },
              {
                review: 'I needed a tent for a last-minute trip, and CampEase delivered! The gear was in perfect condition, and the rental process was so easy.',
                name: 'Shihan Senevirathne',
                location: 'Matale',
                image: Review2Image,
              },
              {
                review: 'CampEase made our group camping trip unforgettable. Affordable prices and excellent service—I’ll definitely rent again!',
                name: 'Sneha Wijekoon',
                location: 'Kandy',
                image: Review3Image,
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border-l-4 border-[#8B4513] w-full sm:w-1/3 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F5DC] opacity-20 rounded-full -mr-16 -mt-16 animate-pulse" />
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-24 sm:w-32 h-24 sm:h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#2F4F4F]"
                  loading="lazy"
                />
                <p className="text-gray-600 italic text-base sm:text-lg mb-4">"{review.review}"</p>
                <p className="font-semibold text-[#8B4513] text-lg sm:text-xl">{review.name}</p>
                <p className="text-gray-600">{review.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Section: Protect Your Camping Gear */}
      <section className="py-16 bg-[#F9F5E0]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <motion.div
              className="w-full sm:w-1/3"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={ProtectGearImage}
                alt="Protect Your Camping Gear"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              className="w-full sm:w-2/3 text-center sm:text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-[#8B4513] mb-4">
                Protect Your Camping Gear Rights, Rent Smart with CampEase!
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6">
                At CampEase, we ensure your camping gear rental experience is smooth and reliable. Rent high-quality equipment with confidence, knowing we’ve got your back with flexible policies and top-notch support.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#F5F5DC] flex items-center justify-center mr-2">
                    <span className="text-[#8B4513]">✔</span>
                  </div>
                  <p className="text-gray-600">Convenient gear pickup</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#F5F5DC] flex items-center justify-center mr-2">
                    <span className="text-[#8B4513]">✔</span>
                  </div>
                  <p className="text-gray-600">Quality-checked equipment</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#F5F5DC] flex items-center justify-center mr-2">
                    <span className="text-[#8B4513]">✔</span>
                  </div>
                  <p className="text-gray-600">Flexible rental adjustments</p>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#F5F5DC] flex items-center justify-center mr-2">
                    <span className="text-[#8B4513]">✔</span>
                  </div>
                  <p className="text-gray-600">24/7 customer support</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Link
                  to="/gear"
                  className="bg-[#8B4513] text-white py-2 px-6 rounded-lg hover:bg-[#2F4F4F] transition-colors flex items-center"
                >
                  <FaCampground className="mr-2" />
                  Get an Adventure
                </Link>
                <p className="text-gray-600 flex items-center">
                  <span className="mr-2">📞</span> Call Anytime 24/7: 071 156 2148
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

     {/* Remade Featured Gear Section */}
      <section className="py-16 bg-[#F8F2DA]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#8B4513] mb-6 text-center">Featured Gear</h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {featuredGear.map((gear, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border-l-4 border-[#8B4513] w-full sm:w-1/3 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F5DC] opacity-20 rounded-full -mr-16 -mt-16 animate-pulse" />
                <img
                  src={gear.image}
                  alt={gear.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  loading="lazy"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-[#8B4513]">{gear.name}</h3>
                <p className="text-gray-600 mt-2">Rs{gear.price}/day</p>
                <Link
                  to="/gear"
                  className="mt-4 inline-block bg-[#1A3C34] text-white py-2 px-4 rounded-lg hover:bg-[#2F4F4F] transition-colors animate-pulse-once"
                >
                  Rent Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Camping Tips Section */}
      <section className="py-16 bg-[#1A3C34]/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Camping Tips for Beginners
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campingTips.map((tip, index) => (
              <motion.div
                key={index}
                className="relative bg-[#F5F5DC]/10 backdrop-blur-sm p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                  loading="lazy"
                />
                <h3 className="text-lg sm:text-xl font-semibold">{tip.title}</h3>
                <p className="mt-2 text-sm sm:text-base">{tip.description}</p>
                <div className="absolute inset-0 bg-[#2F4F4F] opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Remade Explore Destinations Section */}
      <section className="py-16 bg-[#F7F0D5]">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-[#8B4513] mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Explore Camping Destinations
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                className="relative bg-gradient-to-br from-[#FFF9E5] to-[#F5F0D5] p-6 rounded-xl shadow-lg overflow-hidden border border-[#8B4513]/20"
                initial={{ opacity: 0, y: 50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                  boxShadow: "0 0 20px rgba(139, 69, 19, 0.5)",
                  transition: { duration: 0.3 },
                }}
              >
                {/* Decorative Element */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#8B4513]/10 rounded-full -ml-12 -mt-12" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#8B4513]/10 rounded-full -mr-12 -mb-12" />

                {/* Image with Fallback */}
                <div className="w-full h-48 bg-[#F5F5DC]/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if fallback fails
                      e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"; // Fallback image
                    }}
                  />
                </div>

                {/* Destination Info */}
                <h3 className="text-xl sm:text-2xl font-semibold text-[#8B4513] mb-2">
                  {destination.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">{destination.description}</p>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-[#8B4513]/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <p className="text-white font-semibold text-lg">Discover Now</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gradient-to-r from-[#1A3C34]/90 to-[#2F4F4F]/90 text-white relative">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{ backgroundImage: `url(${NewsletterWallpaper})`, opacity: 0.3 }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Stay Updated with CampEase
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto mb-8 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Subscribe to our newsletter for the latest offers, camping tips, and destination guides.
          </motion.p>
          <motion.form
            className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg w-full sm:w-64 text-[#8B4513] focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
            />
            <button className="bg-[#F5F5DC] text-[#8B4513] py-3 px-6 rounded-lg hover:bg-[#2F4F4F] hover:text-white transition-colors animate-bounce w-full sm:w-auto">
              Subscribe
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

export default Home;