// frontend/src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

// Sample featured product images for slideshow (replace with actual paths if available)
import FeaturedProduct1 from '../assets/images/fr01.jpg';
import FeaturedProduct2 from '../assets/images/fr02.jpg';
import FeaturedProduct3 from '../assets/images/fr03.jpg';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const mappedProducts = response.data.map((product) => ({
          ...product,
          productId: product.productId || product._id,
        }));
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    if (priceFilter) {
      if (priceFilter === 'low') {
        filtered = filtered.filter((product) => product.price <= 1000);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter((product) => product.price > 1000 && product.price <= 5000);
      } else if (priceFilter === 'high') {
        filtered = filtered.filter((product) => product.price > 5000);
      }
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, priceFilter, products]);

  // Basic Slideshow Logic
  const featuredImages = [FeaturedProduct1, FeaturedProduct2, FeaturedProduct3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredImages.length - 1 ? 0 : prev + 1));
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [featuredImages.length]);

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="min-h-screen bg-[#FFF9E5]">
      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Basic Slideshow (3 Images, No Text) */}
      <section className="w-full h-96 overflow-hidden">
        <img
          src={featuredImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-full object-cover"
        />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.h2
          className="text-4xl font-bold text-[#8B4513] mb-10 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explore Our Camping Gear
        </motion.h2>

        {/* Filters */}
        <motion.div
          className="flex flex-col md:flex-row justify-between mb-12 space-y-4 md:space-y-0 md:space-x-6 bg-[#F5F5DC]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search gear..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/50 text-gray-600 placeholder-gray-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/50 text-gray-600"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] bg-[#F5F5DC]/50 text-gray-600"
          >
            <option value="">All Prices</option>
            <option value="low">Up to Rs1000</option>
            <option value="medium">Rs1000 - Rs5000</option>
            <option value="high">Above Rs5000</option>
          </select>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.p
            className="text-center text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No gear available at the moment. Check back soon!
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.productId}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#8B4513]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 bg-gradient-to-t from-white to-[#F5F5DC]">
                  <h3 className="text-xl font-semibold text-[#8B4513]">{product.name}</h3>
                  <p className="text-[#1A3C34] mt-1">Rs{product.price} / day</p>
                  <p className="text-gray-600 text-sm mt-2">Category: {product.category}</p>
                  <motion.button
                    onClick={() => {
                      console.log('Add to Cart clicked for:', product);
                      addToCart(product);
                    }}
                    className="mt-4 w-full bg-[#1A3C34] text-white py-2 rounded-lg hover:bg-[#2F4F4F] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;