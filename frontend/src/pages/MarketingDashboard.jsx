// frontend/src/pages/MarketingDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaBullhorn, FaSignOutAlt, FaList, FaBell, FaCampground, FaUserCircle, FaStar, FaHandshake } from 'react-icons/fa';

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg4.jpg';

function MarketingDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('create');
  const [campaigns, setCampaigns] = useState([]);
  const [discountUsers, setDiscountUsers] = useState([]); // Track users with discounts
  const [partnerships, setPartnerships] = useState([]); // Track partnership requests
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState('');
  const [approvedPartnerships, setApprovedPartnerships] = useState([]); // Track approved partnerships

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/marketing/campaigns');
        setCampaigns(response.data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      }
    };

    const fetchDiscountUsers = async () => {
      try {
        const response = await api.get('/user/discounts');
        setDiscountUsers(response.data);
      } catch (err) {
        console.error('Error fetching discount users:', err);
      }
    };

    const fetchPartnerships = async () => {
      try {
        const response = await api.get('/partnership/partnerships');
        console.log('Partnerships fetched:', response.data);
        setPartnerships(response.data);
      } catch (err) {
        console.error('Error fetching partnerships:', err);
      }
    };

    fetchCampaigns();
    fetchDiscountUsers();
    fetchPartnerships();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marketing/campaigns', {
        name,
        type,
        details,
        startDate,
      });
      const response = await api.get('/marketing/campaigns');
      setCampaigns(response.data);
      setName('');
      setType('');
      setDetails('');
      setStartDate('');
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await api.delete(`/marketing/campaigns/${campaignId}`);
      const response = await api.get('/marketing/campaigns');
      setCampaigns(response.data);
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // New function to handle approving a partnership
  const handleApprovePartnership = (partnershipId) => {
    setApprovedPartnerships((prev) => [...prev, partnershipId]);
  };

  // New function to download campaigns as CSV
  const handleDownloadCSV = () => {
    const csv = [
      ['Campaign Name', 'Type', 'Details', 'Start Date'], // Header row
      ...campaigns.map(campaign => [
        campaign.name,
        campaign.type,
        campaign.details,
        new Date(campaign.startDate).toLocaleDateString(),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing_campaigns.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const navLinks = [
    { name: 'Create Campaign', section: 'create', icon: <FaBullhorn className="text-xl" /> },
    { name: 'View Campaigns', section: 'view', icon: <FaList className="text-xl" /> },
    { name: 'Discounts', section: 'discounts', icon: <FaStar className="text-xl" /> },
    { name: 'View Partnerships', section: 'partnerships', icon: <FaHandshake className="text-xl" /> },
  ];

  return (
    <div
      className="flex min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${campingBg})` }}
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div
        className={`fixed top-0 left-0 h-full bg-[#2F4F4F]/80 backdrop-blur-md text-white transition-all duration-300 z-20 animate-slide-in-left ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <FaCampground className="text-3xl text-[#F5F5DC]" />
              <span className="text-xl font-bold tracking-wide">Marketing</span>
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

      <div
        className={`flex-1 flex flex-col transition-all duration-300 z-10 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
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
              <FaBullhorn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>
            <FaBell className="text-[#8B4513] text-xl cursor-pointer hover:text-[#2F4F4F] transition-colors duration-300 animate-pulse-glow" />
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-4xl text-[#2F4F4F]" />
              <span className="text-[#8B4513] font-medium">Hi, {user?.name || 'Marketing Manager'}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeSection === 'create' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaBullhorn className="mr-2 text-[#2F4F4F]" /> Create Marketing Campaign
              </h2>
              <form onSubmit={handleCreateCampaign} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Discount">Discount</option>
                    <option value="Pop-up">Pop-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Details</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <button type="submit" className="btn-camping w-full">
                  Create Campaign
                </button>
              </form>
            </div>
          )}

          {activeSection === 'view' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaList className="mr-2 text-[#2F4F4F]" /> Marketing Campaigns
              </h2>
              {campaigns.length === 0 ? (
                <p className="text-gray-600">No campaigns available.</p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Campaign: {campaign.name}</p>
                      <p className="text-gray-600">Type: {campaign.type}</p>
                      <p className="text-gray-600">Details: {campaign.details}</p>
                      <p className="text-gray-600">Start Date: {new Date(campaign.startDate).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        Delete
                      </button>
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

          {activeSection === 'discounts' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaStar className="mr-2 text-[#2F4F4F]" /> Users with Discounts
              </h2>
              {discountUsers.length === 0 ? (
                <p className="text-gray-600">No users have received discounts yet.</p>
              ) : (
                <div className="space-y-4">
                  {discountUsers.map((user, index) => (
                    <div key={index} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">User: {user.name}</p>
                      <p className="text-gray-600">Email: {user.email}</p>
                      <p className="text-gray-600">Loyalty Points: {user.loyaltyPoints}</p>
                      <h4 className="text-gray-800 font-semibold mt-2">Discounts Applied:</h4>
                      {user.discounts.map((discount, idx) => (
                        <div key={idx} className="ml-4 mt-2">
                          <p className="text-gray-600">Discount: {discount.discountApplied}%</p>
                          <p className="text-gray-600">Total Amount: Rs{discount.totalAmount.toFixed(2)}</p>
                          <p className="text-gray-600">
                            Date: {new Date(discount.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'partnerships' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaHandshake className="mr-2 text-[#2F4F4F]" /> Partnership Requests
              </h2>
              {partnerships.length === 0 ? (
                <p className="text-gray-600">No partnership requests available.</p>
              ) : (
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Title: {partnership.title}</p>
                      <p className="text-gray-600">Contact Number: {partnership.contactNumber}</p>
                      <p className="text-gray-600">Partnership Type: {partnership.partnershipType}</p>
                      <p className="text-gray-600">Message: {partnership.message}</p>
                      <p className="text-gray-600">
                        Submitted On: {new Date(partnership.createdAt).toLocaleDateString()}
                      </p>
                      {/* Show button only if not approved */}
                      {!approvedPartnerships.includes(partnership._id) ? (
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleApprovePartnership(partnership._id)}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <p className="text-green-600 mt-2">This request is approved</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="bg-[#2F4F4F]/80 backdrop-blur-md text-white p-4 text-center">
          <p>© 2025 CampEase. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default MarketingDashboard;