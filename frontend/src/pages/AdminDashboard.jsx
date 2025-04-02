// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaBox, FaDollarSign, FaShoppingCart, FaBullhorn, FaSignOutAlt, FaChartLine, FaUsers, FaBell, FaCampground, FaUserCircle, FaFileExport } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import framer-motion for animations

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg2.jpg'; // Adjust the path if necessary

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newOrders: 0,
    newUsers: 0,
    totalUsers: 0,
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [financialRecords, setFinancialRecords] = useState([]);
  const [rentalData, setRentalData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [users, setUsers] = useState([]); // State for user management
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' }); // State for new user form

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        // Assuming the API returns real data, update with actual values
        setStats({
          totalRevenue: response.data.totalRevenue || 125000, // Example: Rs125,000
          newOrders: response.data.newOrders || 42, // Example: 42 new orders
          newUsers: response.data.newUsers || 15, // Example: 15 new users
          totalUsers: response.data.totalUsers || 320, // Example: 320 total users
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Fallback values if API fails
        setStats({
          totalRevenue: 125000,
          newOrders: 42,
          newUsers: 15,
          totalUsers: 320,
        });
      }
    };

    const fetchInventoryData = async () => {
      try {
        const response = await api.get('/products');
        setInventoryData(response.data);
      } catch (err) {
        console.error('Error fetching inventory data:', err);
      }
    };

    const fetchFinancialRecords = async () => {
      try {
        const response = await api.get('/finance/records');
        setFinancialRecords(response.data);
      } catch (err) {
        console.error('Error fetching financial records:', err);
      }
    };

    const fetchRentalData = async () => {
      try {
        const response = await api.get('/rentals');
        setRentalData(response.data);
      } catch (err) {
        console.error('Error fetching rental data:', err);
      }
    };

    const fetchMarketingData = async () => {
      try {
        const response = await api.get('/marketing/campaigns');
        setMarketingData(response.data);
      } catch (err) {
        console.error('Error fetching marketing data:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchStats();
    fetchInventoryData();
    fetchFinancialRecords();
    fetchRentalData();
    fetchMarketingData();
    fetchUsers();
  }, []);

  // Delete Functions for Each Section
  const handleDeleteInventory = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setInventoryData(inventoryData.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting inventory item:', err);
    }
  };

  const handleDeleteFinancialRecord = async (id) => {
    try {
      await api.delete(`/finance/records/${id}`);
      setFinancialRecords(financialRecords.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting financial record:', err);
    }
  };

  const handleDeleteRental = async (id) => {
    try {
      await api.delete(`/rentals/${id}`);
      setRentalData(rentalData.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting rental:', err);
    }
  };

  const handleDeleteMarketingCampaign = async (id) => {
    try {
      await api.delete(`/marketing/campaigns/${id}`);
      setMarketingData(marketingData.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting marketing campaign:', err);
    }
  };

  // Create User Function
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '', password: '' }); // Reset form
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // Delete User Function
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    { name: 'Overview', section: 'overview', icon: <FaChartLine className="text-xl" /> },
    { name: 'Inventory Data', section: 'inventory', icon: <FaBox className="text-xl" /> },
    { name: 'Financial Records', section: 'finance', icon: <FaDollarSign className="text-xl" /> },
    { name: 'Rental Data', section: 'rentals', icon: <FaShoppingCart className="text-xl" /> },
    { name: 'Marketing Data', section: 'marketing', icon: <FaBullhorn className="text-xl" /> },
    { name: 'User Management', section: 'users', icon: <FaUsers className="text-xl" /> },
  ];

  return (
    <div
      className="flex min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${campingBg})`, // Camping background image
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Sidebar with Transparency and Slide-In Animation */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#2F4F4F]/80 backdrop-blur-md text-white transition-all duration-300 z-20 animate-slide-in-left ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <FaCampground className="text-3xl text-[#F5F5DC]" />
              <span className="text-xl font-bold tracking-wide">Admin</span>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        <nav className="mt-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveSection(link.section)}
              className={`flex items-center p-4 w-full text-left hover:bg-[#1A3C34] transition-colors duration-300 ${
                activeSection === link.section ? 'bg-[#1A3C34]' : ''
              }`}
            >
              {link.icon}
              {isSidebarOpen && <span className="ml-4">{link.name}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center p-4 w-full hover:bg-red-600 transition-colors duration-300"
          >
            <FaSignOutAlt className="text-xl" />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 z-10 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {/* Top Bar with Fade-In Animation */}
        <div className="bg-[#F5F5DC] shadow-lg p-4 flex justify-between items-center animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <FaCampground className="text-2xl text-[#2F4F4F]" />
            <span className="text-xl font-bold text-[#8B4513] tracking-wide">CampEase</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
              />
              <FaChartLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>
            <FaBell className="text-[#8B4513] text-xl cursor-pointer hover:text-[#2F4F4F] transition-colors duration-300 animate-pulse-glow" />
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-4xl text-[#2F4F4F]" />
              <span className="text-[#8B4513] font-medium">Hi, {user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div>
              {/* Stats Cards with Animations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <motion.div
                  className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Total Revenue</h3>
                    <FaDollarSign className="text-[#2F4F4F] text-2xl" />
                  </div>
                  <motion.p
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Rs{stats.totalRevenue.toLocaleString()}
                  </motion.p>
                  <p className="text-gray-500 text-sm mt-2">All Customers Value</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <motion.div
                      className="bg-[#2F4F4F] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.totalRevenue / 200000) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Change: {((stats.totalRevenue / 200000) * 100).toFixed(1)}%
                  </p>
                </motion.div>

                <motion.div
                  className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#8B4513]">New Orders</h3>
                    <FaShoppingCart className="text-[#2F4F4F] text-2xl" />
                  </div>
                  <motion.p
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {stats.newOrders}
                  </motion.p>
                  <p className="text-gray-500 text-sm mt-2">Fresh Order Amount</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <motion.div
                      className="bg-[#8B4513] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.newOrders / 100) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Change: {((stats.newOrders / 100) * 100).toFixed(1)}%
                  </p>
                </motion.div>

                <motion.div
                  className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#8B4513]">New Users</h3>
                    <FaUsers className="text-[#2F4F4F] text-2xl" />
                  </div>
                  <motion.p
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {stats.newUsers}
                  </motion.p>
                  <p className="text-gray-500 text-sm mt-2">Joined New User</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <motion.div
                      className="bg-[#2F4F4F] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.newUsers / 50) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Change: {((stats.newUsers / 50) * 100).toFixed(1)}%
                  </p>
                </motion.div>

                <motion.div
                  className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Total Users</h3>
                    <FaUsers className="text-[#2F4F4F] text-2xl" />
                  </div>
                  <motion.p
                    className="text-3xl font-bold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {stats.totalUsers}
                  </motion.p>
                  <p className="text-gray-500 text-sm mt-2">All Users</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <motion.div
                      className="bg-[#8B4513] h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.totalUsers / 500) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Change: {((stats.totalUsers / 500) * 100).toFixed(1)}%
                  </p>
                </motion.div>
              </div>

              {/* Charts and Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#8B4513] flex items-center">
                      <FaChartLine className="mr-2 text-[#2F4F4F]" /> User Statistics
                    </h3>
                    <div className="flex space-x-2">
                      <button className="btn-camping">
                        <FaFileExport className="inline mr-2" /> Export
                      </button>
                      <button className="bg-[#2F4F4F] text-white py-2 px-4 rounded-lg hover:bg-[#1A3C34] transition-all duration-300 transform hover:scale-105 shadow-md">
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-gray-400 text-4xl" />
                    <p className="text-gray-500 ml-2">Chart Placeholder (Add Chart.js or similar)</p>
                  </div>
                </div>

                <div className="bg-[#2F4F4F]/90 backdrop-blur-sm text-white p-6 rounded-xl shadow-xl animate-bounce-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <button className="bg-[#F5F5DC] text-[#2F4F4F] px-4 py-2 rounded-lg hover:bg-[#E5E5B2] transition-all duration-300">
                      <FaFileExport className="inline mr-2" /> Export
                    </button>
                  </div>
                  <p className="text-sm mb-2">March 25 - April 02</p>
                  <p className="text-3xl font-bold">Rs{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Data Section */}
          {activeSection === 'inventory' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaBox className="mr-2 text-[#2F4F4F]" /> Inventory Data
              </h2>
              {inventoryData.length === 0 ? (
                <p className="text-gray-600">No products available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventoryData.map((product) => (
                    <div key={product._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-gray-600">Price: Rs{product.price} / day</p>
                      <p className="text-gray-600">Category: {product.category}</p>
                      <p className="text-gray-600">Stock: {product.stock}</p>
                      <p className="text-gray-600">Status: {product.status || 'Available'}</p>
                      <button
                        onClick={() => handleDeleteInventory(product._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Financial Records Section */}
          {activeSection === 'finance' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaDollarSign className="mr-2 text-[#2F4F4F]" /> Financial Records
              </h2>
              {financialRecords.length === 0 ? (
                <p className="text-gray-600">No financial records available.</p>
              ) : (
                <div className="space-y-4">
                  {financialRecords.map((record) => (
                    <div key={record._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Type: {record.type}</p>
                      <p className="text-gray-600">Amount: Rs{record.amount}</p>
                      <p className="text-gray-600">Description: {record.description}</p>
                      <p className="text-gray-600">Date: {new Date(record.date).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleDeleteFinancialRecord(record._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rental Data Section */}
          {activeSection === 'rentals' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaShoppingCart className="mr-2 text-[#2F4F4F]" /> Rental Data
              </h2>
              {rentalData.length === 0 ? (
                <p className="text-gray-600">No rental orders available.</p>
              ) : (
                <div className="space-y-4">
                  {rentalData.map((rental) => (
                    <div key={rental._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Customer: {rental.customerId}</p>
                      <p className="text-gray-600">Total Price: Rs{rental.totalPrice}</p>
                      <p className="text-gray-600">Status: {rental.status}</p>
                      <p className="text-gray-600">Rental Date: {new Date(rental.rentalDate).toLocaleDateString()}</p>
                      <p className="text-gray-600">Return Date: {new Date(rental.returnDate).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleDeleteRental(rental._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Marketing Data Section */}
          {activeSection === 'marketing' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaBullhorn className="mr-2 text-[#2F4F4F]" /> Marketing Data
              </h2>
              {marketingData.length === 0 ? (
                <p className="text-gray-600">No marketing campaigns available.</p>
              ) : (
                <div className="space-y-4">
                  {marketingData.map((campaign) => (
                    <div key={campaign._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Campaign: {campaign.name}</p>
                      <p className="text-gray-600">Type: {campaign.type}</p>
                      <p className="text-gray-600">Details: {campaign.details}</p>
                      <p className="text-gray-600">Start Date: {new Date(campaign.startDate).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleDeleteMarketingCampaign(campaign._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Management Section */}
          {activeSection === 'users' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaUsers className="mr-2 text-[#2F4F4F]" /> User Management
              </h2>

              {/* Create User Form */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Create New User</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#2F4F4F] text-white py-2 rounded-lg hover:bg-[#1A3C34] transition-colors"
                  >
                    Create User
                  </button>
                </form>
              </div>

              {/* User List */}
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Existing Users</h3>
              {users.length === 0 ? (
                <p className="text-gray-600">No users available.</p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Name: {user.name}</p>
                      <p className="text-gray-600">Email: {user.email}</p>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <footer className="bg-[#2F4F4F]/80 backdrop-blur-md text-white p-4 text-center">
          <p>© 2025 CampEase. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default AdminDashboard;