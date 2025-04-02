// frontend/src/pages/RentalDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaShoppingCart, FaSignOutAlt, FaList, FaBell, FaCampground, FaUserCircle, FaTrash } from 'react-icons/fa';

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg5.jpg'; // Adjust the path if necessary

function RentalDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('manage');
  const [rentals, setRentals] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [rentalDate, setRentalDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('Pending');
  // New state for filtering rentals by status
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get('/rentals');
        setRentals(response.data);
      } catch (err) {
        console.error('Error fetching rentals:', err);
      }
    };
    fetchRentals();
  }, []);

  const handleCreateRental = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rentals', {
        customerId,
        totalPrice: Number(totalPrice),
        rentalDate,
        returnDate,
        status,
      });
      const response = await api.get('/rentals');
      setRentals(response.data);
      setCustomerId('');
      setTotalPrice('');
      setRentalDate('');
      setReturnDate('');
      setStatus('Pending');
    } catch (err) {
      console.error('Error creating rental:', err);
    }
  };

  const handleUpdateStatus = async (rentalId, status) => {
    try {
      await api.put(`/rentals/${rentalId}`, { status });
      const response = await api.get('/rentals');
      setRentals(response.data);
    } catch (err) {
      console.error('Error updating rental status:', err);
    }
  };

  const handleDeleteRental = async (rentalId) => {
    try {
      await api.delete(`/rentals/${rentalId}`);
      const response = await api.get('/rentals');
      setRentals(response.data);
    } catch (err) {
      console.error('Error deleting rental:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter rentals based on the selected status
  const filteredRentals = filterStatus === 'All' ? rentals : rentals.filter(rental => rental.status === filterStatus);

  const navLinks = [
    { name: 'Manage Rentals', section: 'manage', icon: <FaShoppingCart className="text-xl" /> },
    { name: 'View Rentals', section: 'view', icon: <FaList className="text-xl" /> },
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
              <span className="text-xl font-bold tracking-wide">Rentals</span>
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
              <FaShoppingCart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>
            <FaBell className="text-[#8B4513] text-xl cursor-pointer hover:text-[#2F4F4F] transition-colors duration-300 animate-pulse-glow" />
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-4xl text-[#2F4F4F]" />
              <span className="text-[#8B4513] font-medium">Hi, {user?.name || 'Rental Manager'}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Manage Rentals Section */}
          {activeSection === 'manage' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaShoppingCart className="mr-2 text-[#2F4F4F]" /> Manage Rental Orders
              </h2>
              {/* Form to Create a New Rental */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Create New Rental</h3>
                <form onSubmit={handleCreateRental} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Customer ID</label>
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Total Price (Rs)</label>
                    <input
                      type="number"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Rental Date</label>
                    <input
                      type="date"
                      value={rentalDate}
                      onChange={(e) => setRentalDate(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-camping w-full">
                    Create Rental
                  </button>
                </form>
              </div>

              {/* Existing Rentals List with Filter */}
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Existing Rental Orders</h3>
              {/* Add Filter Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full sm:w-1/4 px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              {filteredRentals.length === 0 ? (
                <p className="text-gray-600">No rental orders available for this status.</p>
              ) : (
                <div className="space-y-4">
                  {filteredRentals.map((rental) => (
                    <div key={rental._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Customer: {rental.customerId}</p>
                      <p className="text-gray-600">Total Price: Rs{rental.totalPrice}</p>
                      <p className="text-gray-600">Status: {rental.status}</p>
                      <p className="text-gray-600">Rental Date: {new Date(rental.rentalDate).toLocaleDateString()}</p>
                      <p className="text-gray-600">Return Date: {new Date(rental.returnDate).toLocaleDateString()}</p>
                      <div className="flex space-x-2 mt-2">
                        {rental.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(rental._id, 'Approved')}
                              className="btn-camping flex-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(rental._id, 'Rejected')}
                              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {rental.status === 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(rental._id, 'Returned')}
                            className="flex-1 bg-[#2F4F4F] text-white px-4 py-2 rounded-lg hover:bg-[#1A3C34] transition-all duration-300 transform hover:scale-105 shadow-md"
                          >
                            Mark as Returned
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRental(rental._id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                          <FaTrash className="inline mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Rentals Section */}
          {activeSection === 'view' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaList className="mr-2 text-[#2F4F4F]" /> Rental Orders
              </h2>
              {/* Add Filter Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full sm:w-1/4 px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              {filteredRentals.length === 0 ? (
                <p className="text-gray-600">No rental orders available for this status.</p>
              ) : (
                <div className="space-y-4">
                  {filteredRentals.map((rental) => (
                    <div key={rental._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Customer: {rental.customerId}</p>
                      <p className="text-gray-600">Total Price: Rs{rental.totalPrice}</p>
                      <p className="text-gray-600">Status: {rental.status}</p>
                      <p className="text-gray-600">Rental Date: {new Date(rental.rentalDate).toLocaleDateString()}</p>
                      <p className="text-gray-600">Return Date: {new Date(rental.returnDate).toLocaleDateString()}</p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleDeleteRental(rental._id)}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                          <FaTrash className="inline mr-2" /> Delete
                        </button>
                      </div>
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

export default RentalDashboard;