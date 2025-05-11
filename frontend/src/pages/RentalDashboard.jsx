// frontend/src/pages/RentalDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaShoppingCart, FaSignOutAlt, FaList, FaBell, FaCampground, FaUserCircle, FaTrash, FaChartBar, FaSearch, FaBox } from 'react-icons/fa';

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
  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  // New state for bulk status update
  const [selectedRentals, setSelectedRentals] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('Pending');
  // New state for gear rentals
  const [gearRentals, setGearRentals] = useState([]);
  const [gearCustomerId, setGearCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [gearRentalDate, setGearRentalDate] = useState('');
  const [gearReturnDate, setGearReturnDate] = useState('');
  const [gearStatus, setGearStatus] = useState('Pending');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get('/rentals');
        setRentals(response.data);
      } catch (err) {
        console.error('Error fetching rentals:', err);
      }
    };
    const fetchGearRentals = async () => {
      try {
        const response = await api.get('/gear-rentals');
        setGearRentals(response.data);
      } catch (err) {
        console.error('Error fetching gear rentals:', err);
      }
    };
    fetchRentals();
    fetchGearRentals();
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

  const handleCreateGearRental = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gear-rentals', {
        customerId: gearCustomerId,
        productId,
        quantity: Number(quantity),
        rentalDate: gearRentalDate,
        returnDate: gearReturnDate,
        status: gearStatus,
      });
      const response = await api.get('/gear-rentals');
      setGearRentals(response.data);
      setGearCustomerId('');
      setProductId('');
      setQuantity('');
      setGearRentalDate('');
      setGearReturnDate('');
      setGearStatus('Pending');
    } catch (err) {
      console.error('Error creating gear rental:', err);
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

  // New function to pre-fill the form with sample data
  const handlePrefillForm = () => {
    setCustomerId('CUST123');
    setTotalPrice('1500');
    setRentalDate(new Date().toISOString().split('T')[0]); // Today's date
    setReturnDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 7 days from today
    setStatus('Pending');
  };

  // New function to download rentals as CSV
  const handleDownloadCSV = () => {
    const csv = [
      ['Customer ID', 'Total Price', 'Status', 'Rental Date', 'Return Date'], // Header row
      ...filteredRentals.map(rental => [
        rental.customerId,
        `Rs${rental.totalPrice}`,
        rental.status,
        new Date(rental.rentalDate).toLocaleDateString(),
        new Date(rental.returnDate).toLocaleDateString(),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rental_orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // New function to handle bulk status update
  const handleBulkStatusUpdate = async () => {
    if (selectedRentals.length === 0) {
      alert('Please select at least one rental to update.');
      return;
    }
    try {
      await Promise.all(
        selectedRentals.map(rentalId =>
          api.put(`/rentals/${rentalId}`, { status: bulkStatus })
        )
      );
      const response = await api.get('/rentals');
      setRentals(response.data);
      setSelectedRentals([]); // Clear selection after update
    } catch (err) {
      console.error('Error bulk updating rental status:', err);
    }
  };

  // New function to toggle rental selection for bulk update
  const toggleRentalSelection = (rentalId) => {
    setSelectedRentals(prev =>
      prev.includes(rentalId)
        ? prev.filter(id => id !== rentalId)
        : [...prev, rentalId]
    );
  };

  // New function to calculate rental summary
  const getRentalSummary = () => {
    const totalRentals = rentals.length;
    const statusBreakdown = {
      Pending: rentals.filter(r => r.status === 'Pending').length,
      Approved: rentals.filter(r => r.status === 'Approved').length,
      Rejected: rentals.filter(r => r.status === 'Rejected').length,
      Returned: rentals.filter(r => r.status === 'Returned').length,
    };
    const totalRevenue = rentals.reduce((sum, rental) => sum + rental.totalPrice, 0);

    return { totalRentals, statusBreakdown, totalRevenue };
  };

  // Search functionality for rentals
  const searchedRentals = searchQuery
    ? filteredRentals.filter(rental =>
        rental.customerId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredRentals;

  const navLinks = [
    { name: 'Manage reservation', section: 'manage', icon: <FaShoppingCart className="text-xl" /> },
    { name: 'View reservation', section: 'view', icon: <FaList className="text-xl" /> },
    { name: 'Create Gear Rental', section: 'gear', icon: <FaBox className="text-xl" /> },
    { name: 'Summary', section: 'summary', icon: <FaChartBar className="text-xl" /> },
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
              <span className="text-xl font-bold tracking-wide">reservation</span>
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
                <FaShoppingCart className="mr-2 text-[#2F4F4F]" /> Manage reservation Orders
              </h2>
              {/* Form to Create a New Rental */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Create New reservation</h3>
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
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">reservation Date</label>
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
                  <div className="flex space-x-2">
                    <button type="submit" className="btn-camping flex-1">
                      Create reservation
                    </button>
                    <button
                      type="button"
                      onClick={handlePrefillForm}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Pre-fill Form
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Rentals List with Filter */}
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Existing reservation Orders</h3>
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
              {/* Bulk Status Update Section */}
              <div className="mb-4">
                <h4 className="text-md font-semibold text-[#8B4513] mb-2">Bulk Update Status</h4>
                <div className="flex space-x-2">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="w-full sm:w-1/4 px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Returned">Returned</option>
                  </select>
                  <button
                    onClick={handleBulkStatusUpdate}
                    className="bg-[#2F4F4F] text-white px-4 py-2 rounded-lg hover:bg-[#1A3C34] transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Apply to Selected
                  </button>
                </div>
              </div>
              {filteredRentals.length === 0 ? (
                <p className="text-gray-600">No reservation orders available for this status.</p>
              ) : (
                <div className="space-y-4">
                  {filteredRentals.map((rental) => (
                    <div key={rental._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={selectedRentals.includes(rental._id)}
                          onChange={() => toggleRentalSelection(rental._id)}
                          className="mr-2"
                        />
                        <p className="text-gray-800 font-semibold">Customer: {rental.customerId}</p>
                      </div>
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
                              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md"
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
              {/* Add Search Bar */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">Search by Customer ID</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Customer ID..."
                    className="w-full sm:w-1/4 px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
                </div>
              </div>
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
              {searchedRentals.length === 0 ? (
                <p className="text-gray-600">No rental orders available for this status or search query.</p>
              ) : (
                <div className="space-y-4">
                  {searchedRentals.map((rental) => (
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
                  <button
                    onClick={handleDownloadCSV}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Download CSV
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Create Gear Rental Section */}
          {activeSection === 'gear' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaBox className="mr-2 text-[#2F4F4F]" /> Create Gear Rental
              </h2>
              {/* Form to Create a New Gear Rental */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Create New Gear Rental</h3>
                <form onSubmit={handleCreateGearRental} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Customer ID</label>
                    <input
                      type="text"
                      value={gearCustomerId}
                      onChange={(e) => setGearCustomerId(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Product ID</label>
                    <input
                      type="text"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Rental Date</label>
                    <input
                      type="date"
                      value={gearRentalDate}
                      onChange={(e) => setGearRentalDate(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Return Date</label>
                    <input
                      type="date"
                      value={gearReturnDate}
                      onChange={(e) => setGearReturnDate(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B4513] mb-2">Status</label>
                    <select
                      value={gearStatus}
                      onChange={(e) => setGearStatus(e.target.value)}
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
                    Create Gear Rental
                  </button>
                </form>
              </div>

              {/* Existing Gear Rentals List */}
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Existing Gear Rentals</h3>
              {gearRentals.length === 0 ? (
                <p className="text-gray-600">No gear rentals available.</p>
              ) : (
                <div className="space-y-4">
                  {gearRentals.map((rental) => (
                    <div key={rental._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Customer: {rental.customerId}</p>
                      <p className="text-gray-600">Product ID: {rental.productId}</p>
                      <p className="text-gray-600">Quantity: {rental.quantity}</p>
                      <p className="text-gray-600">Status: {rental.status}</p>
                      <p className="text-gray-600">Rental Date: {new Date(rental.rentalDate).toLocaleDateString()}</p>
                      <p className="text-gray-600">Return Date: {new Date(rental.returnDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary Section */}
          {activeSection === 'summary' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaChartBar className="mr-2 text-[#2F4F4F]" /> Rental Summary
              </h2>
              <div className="space-y-4">
                <div className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                  <p className="text-gray-800 font-semibold">Total Rentals: {getRentalSummary().totalRentals}</p>
                  <p className="text-gray-600">Total Revenue: Rs{getRentalSummary().totalRevenue.toFixed(2)}</p>
                  <h4 className="text-gray-800 font-semibold mt-2">Status Breakdown:</h4>
                  <p className="text-gray-600">Pending: {getRentalSummary().statusBreakdown.Pending}</p>
                  <p className="text-gray-600">Approved: {getRentalSummary().statusBreakdown.Approved}</p>
                  <p className="text-gray-600">Rejected: {getRentalSummary().statusBreakdown.Rejected}</p>
                  <p className="text-gray-600">Returned: {getRentalSummary().statusBreakdown.Returned}</p>
                </div>
              </div>
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