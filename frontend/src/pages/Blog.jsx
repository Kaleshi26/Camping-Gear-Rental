import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowRight, FaSearch } from 'react-icons/fa';

// Import Assets
import BlogBackground from '../assets/images/camping-background10.jpg'; // Background image
import BlogImage1 from '../assets/images/campsite-tip.jpg';
import BlogImage2 from '../assets/images/pack-light.jpg';
import BlogImage3 from '../assets/images/stay-safe.jpg';
import BlogImage4 from '../assets/images/gear-quality.jpg';
import BlogImage5 from '../assets/images/yala-national-park.jpg';
import BlogImage6 from '../assets/images/premium-tent.jpg';
import BlogImage7 from '../assets/images/camping-stove.jpg';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Blog Post Data (7 posts)
  const blogPosts = [
    {
      id: 1,
      title: 'Top 5 Tips for a Perfect Camping Trip',
      excerpt: 'Learn how to make your camping adventure unforgettable with these expert tips.',
      image: BlogImage1,
      date: 'March 25, 2025',
      author: 'Sarah M.',
      category: 'Tips',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Camping is more than just a getaway—it’s a chance to reconnect with nature. At CampEase, we believe everyone deserves a stellar outdoor experience. Here are our top 5 tips to ensure your next trip is a success:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Choose a scenic campsite with flat ground and shade.</li>
            <li>Pack light but include essentials like a first-aid kit.</li>
            <li>Rent quality gear from CampEase for comfort and reliability.</li>
            <li>Plan your meals ahead to avoid food waste.</li>
            <li>Leave no trace—keep nature pristine for others.</li>
          </ul>
          <p className="text-gray-600">
            Ready to hit the trails? Rent your gear with us and start your adventure today!
          </p>
        </>
      ),
    },
    {
      id: 2,
      title: 'Why Renting Gear Beats Buying',
      excerpt: 'Discover the benefits of renting camping equipment with CampEase.',
      image: BlogImage2,
      date: 'March 28, 2025',
      author: 'John Doe',
      category: 'Gear',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Buying camping gear can be expensive and impractical if you only camp occasionally. With CampEase, renting is the smart choice. Here’s why:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Save money—no need to invest in gear you rarely use.</li>
            <li>Access top-quality equipment without storage hassles.</li>
            <li>Try before you buy—test gear to find what suits you.</li>
          </ul>
          <p className="text-gray-600">
            Renting with CampEase is hassle-free and budget-friendly. Check out our gear today!
          </p>
        </>
      ),
    },
    {
      id: 3,
      title: 'Best Camping Destinations in Sri Lanka',
      excerpt: 'Explore the top spots for your next outdoor escape.',
      image: BlogImage3,
      date: 'April 1, 2025',
      author: 'Priya K.',
      category: 'Destinations',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Sri Lanka is a camper’s paradise, offering diverse landscapes from mountains to beaches. Here are our top picks:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Yala National Park: Wildlife and starry nights.</li>
            <li>Ella Mountains: Breathtaking views and cool trails.</li>
            <li>Wilpattu National Park: Serenity and natural beauty.</li>
          </ul>
          <p className="text-gray-600">
            Gear up with CampEase and explore these stunning destinations. Book now!
          </p>
        </>
      ),
    },
    {
      id: 4,
      title: 'How to Choose the Right Camping Gear',
      excerpt: 'A guide to selecting the best equipment for your camping needs.',
      image: BlogImage4,
      date: 'April 5, 2025',
      author: 'Mark L.',
      category: 'Gear',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Picking the right gear can make or break your camping trip. Here’s how to choose wisely:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Consider your trip duration—short trips need less gear.</li>
            <li>Check weather conditions—opt for waterproof tents if rain is forecast.</li>
            <li>Rent from CampEase for lightweight, durable options.</li>
          </ul>
          <p className="text-gray-600">
            Not sure where to start? Browse our collection and find your perfect match!
          </p>
        </>
      ),
    },
    {
      id: 5,
      title: 'Wildlife Safety Tips for Campers',
      excerpt: 'Stay safe and respect nature with these wildlife guidelines.',
      image: BlogImage5,
      date: 'April 10, 2025',
      author: 'Nimal S.',
      category: 'Safety',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Camping near wildlife is thrilling but requires caution. Follow these tips:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Store food securely to avoid attracting animals.</li>
            <li>Keep a safe distance—observe wildlife from afar.</li>
            <li>Know local species and their behaviors.</li>
          </ul>
          <p className="text-gray-600">
            Stay prepared with CampEase gear and enjoy a safe trip!
          </p>
        </>
      ),
    },
    {
      id: 6,
      title: 'The Ultimate Guide to Tent Setup',
      excerpt: 'Master the art of pitching your tent like a pro.',
      image: BlogImage6,
      date: 'April 15, 2025',
      author: 'Lakshmi P.',
      category: 'Tips',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Setting up a tent can be daunting for beginners. Here’s a step-by-step guide:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Find a flat, clear spot away from hazards.</li>
            <li>Lay out your tent and secure the corners with stakes.</li>
            <li>Assemble poles and attach the rainfly for weather protection.</li>
          </ul>
          <p className="text-gray-600">
            Rent a tent from CampEase and practice at home before your trip!
          </p>
        </>
      ),
    },
    {
      id: 7,
      title: 'Cooking Outdoors: Easy Camping Recipes',
      excerpt: 'Delicious meals to cook over a campfire or stove.',
      image: BlogImage7,
      date: 'April 20, 2025',
      author: 'Ravi T.',
      category: 'Food',
      content: (
        <>
          <p className="text-gray-600 mb-4">
            Elevate your camping experience with these simple recipes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Foil Packet Potatoes: Potatoes, butter, and herbs.</li>
            <li>Campfire Skewers: Veggies and meat grilled to perfection.</li>
            <li>S’mores: A classic treat with graham crackers and chocolate.</li>
          </ul>
          <p className="text-gray-600">
            Rent a stove from CampEase and whip up these dishes on your next trip!
          </p>
        </>
      ),
    },
  ];

  // Filter blog posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const cardHover = {
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-[#FFF9E5] min-h-screen">
      {/* Header Section with Blurred Background on h1 */}
      <section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white text-center px-4 py-8"
          style={{
            backgroundImage: `url(${BlogBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.7)', // Blur and slight dimming for readability
            WebkitFilter: 'blur(8px) brightness(0.7)', // For browser compatibility
            transform: 'scale(1.1)', // Slight scale to avoid edge gaps
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.span
          className="relative text-4xl md:text-6xl font-bold text-white text-center px-4 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          CampEase Blog
        </motion.span>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#8B4513] text-center mb-12"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Latest Camping Insights
          </motion.h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between mb-12 space-y-4 md:space-y-0 md:space-x-6 bg-[#F5F5DC]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            {/* Search */}
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/50 text-gray-600 placeholder-gray-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/50 text-gray-600"
            >
              <option value="">All Categories</option>
              {[...new Set(blogPosts.map((post) => post.category))].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                variants={cardHover}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#8B4513] mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <FaCalendarAlt className="mr-2 text-[#1A3C34]" />
                    <span>{post.date}</span>
                    <FaUser className="ml-4 mr-2 text-[#1A3C34]" />
                    <span>{post.author}</span>
                  </div>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileHover={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {post.content}
                  </motion.div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#1A3C34] font-semibold hover:text-[#2F4F4F] transition-colors mt-4"
                  >
                    Read More <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#1A3C34] text-white rounded-lg hover:bg-[#2F4F4F] disabled:bg-gray-400 transition-colors"
            >
              Previous
            </button>
            <span className="text-[#8B4513] font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#1A3C34] text-white rounded-lg hover:bg-[#2F4F4F] disabled:bg-gray-400 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-[#1A3C34] to-[#2F4F4F] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Ready to Camp with Ease?
          </motion.h2>
          <motion.p
            className="max-w-2xl mx-auto mb-8 text-gray-200"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore our blog for more tips, then rent your gear with CampEase for an unforgettable adventure.
          </motion.p>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link
              to="/gear"
              className="bg-[#F5F5DC] text-[#8B4513] py-3 px-6 rounded-lg font-semibold hover:bg-[#2F4F4F] hover:text-white transition-colors inline-flex items-center"
            >
              Rent Gear Now <FaArrowRight className="ml-2 animate-pulse" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;