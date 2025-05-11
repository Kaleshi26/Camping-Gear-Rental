// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaBox, FaDollarSign, FaShoppingCart, FaBullhorn, FaSignOutAlt, FaChartLine, FaUsers, FaBell, FaCampground, FaUserCircle, FaFileExport } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

// Import the background image
import campingBg from '../assets/camping-bg2.jpg';

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
  const [transactions, setTransactions] = useState([]);
  const [rentalData, setRentalData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', department: '', salary: '' });
  const [financeError, setFinanceError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats({
          totalRevenue: response.data.totalRevenue || 125000,
          newOrders: response.data.newOrders || 42,
          newUsers: response.data.newUsers || 15,
          totalUsers: response.data.totalUsers || 320,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
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

    const fetchFinancialData = async () => {
      try {
        setFinanceError('');
        const recordsResponse = await api.get('/finance/records');
        console.log('Financial Records:', recordsResponse.data);
        setFinancialRecords(recordsResponse.data || []);
        const transactionsResponse = await api.get('/finance/transactions');
        console.log('Transactions:', transactionsResponse.data);
        setTransactions(transactionsResponse.data || []);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        let errorMsg = 'Failed to load financial data. Please try again later.';
        if (err.response) {
          console.error('Error Status:', err.response.status);
          console.error('Error Data:', err.response.data);
          if (err.response.status === 401 || err.response.status === 403) {
            errorMsg = 'Unauthorized: Admin access required for financial data.';
          } else if (err.response.status === 404) {
            errorMsg = 'Financial data endpoints not found.';
          }
        }
        setFinanceError(errorMsg);
        setFinancialRecords([]);
        setTransactions([]);
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

    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        setEmployees(response.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchStats();
    fetchInventoryData();
    fetchFinancialData();
    fetchRentalData();
    fetchMarketingData();
    fetchEmployees();
  }, []);

  const handleDeleteInventory = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setInventoryData(inventoryData.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting inventory item:', err);
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

  const handleCheckCampaign = async (id) => {
    try {
      const response = await api.post(`/marketing/campaigns/${id}/check`);
      setMarketingData(
        marketingData.map((campaign) =>
          campaign._id === id ? { ...campaign, checked: true } : campaign
        )
      );
    } catch (err) {
      console.error('Error checking campaign:', err);
      alert('Failed to check campaign');
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/employees', {
        ...newEmployee,
        salary: Number(newEmployee.salary),
      });
      setEmployees([...employees, response.data]);
      setNewEmployee({ name: '', email: '', department: '', salary: '' });
    } catch (err) {
      console.error('Error creating employee:', err);
      alert('Failed to create employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  const handleExportStatsCSV = () => {
    const headers = ['Metric', 'Value'];
    const csvRows = [
      headers.join(','),
      ['Total Revenue', `Rs${stats.totalRevenue.toLocaleString()}`],
      ['New Orders', stats.newOrders],
      ['New Users', stats.newUsers],
      ['Total Users', stats.totalUsers],
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'admin-stats.csv');
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportEmployeesCSV = () => {
    const headers = ['Name', 'Email', 'Department', 'Salary'];
    const csvRows = [
      headers.join(','),
      ...employees.map((employee) =>
        [
          `"${employee.name}"`,
          `"${employee.email}"`,
          `"${employee.department}"`,
          `Rs${employee.salary.toLocaleString()}`
        ].join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'employees.csv');
    a.click();
    window.URL.revokeObjectURL(url);
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

  const pieChartData = {
    labels: ['Non-Refunded Transactions', 'Refunded Transactions'],
    datasets: [
      {
        data: [
          transactions.filter((t) => !t.refunded).length,
          transactions.filter((t) => t.refunded).length,
        ],
        backgroundColor: ['#2F4F4F', '#8B4513'],
        borderColor: ['#1A3C34', '#5A2D0C'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Transaction Status Distribution',
      },
    },
  };

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
      <div
        className={`flex-1 flex flex-col transition-all duration-300 z-10 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
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
              <FaChartLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>
            <FaBell className="text-[#8B4513] text-xl cursor-pointer hover:text-[#2F4F4F] transition-colors duration-300 animate-pulse-glow" />
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-4xl text-[#2F4F4F]" />
              <span className="text-[#8B4513] font-medium">Hi, {user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          {activeSection === 'overview' && (
            <div>
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
                      transition={{ duration: 1, ease: 'easeOut' }}
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
                      transition={{ duration: 1, ease: 'easeOut' }}
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
                      transition={{ duration: 1, ease: 'easeOut' }}
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
                      transition={{ duration: 1, ease: 'easeOut' }}
                    ></motion.div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Change: {((stats.totalUsers / 500) * 100).toFixed(1)}%
                  </p>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#8B4513] flex items-center">
                      <FaChartLine className="mr-2 text-[#2F4F4F]" /> Transaction Statistics
                    </h3>
                    <div className="flex space-x-2">
                      <button onClick={handleExportStatsCSV} className="btn-camping">
                        <FaFileExport className="inline mr-2" /> Export Stats
                      </button>
                      <button className="bg-[#2F4F4F] text-white py-2 px-4 rounded-lg hover:bg-[#1A3C34] transition-all duration-300 transform hover:scale-105 shadow-md">
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="h-64">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </div>
                <div className="bg-[#2F4F4F]/90 backdrop-blur-sm text-white p-6 rounded-xl shadow-xl animate-bounce-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <button
                      onClick={handleExportStatsCSV}
                      className="bg-[#F5F5DC] text-[#2F4F4F] px-4 py-2 rounded-lg hover:bg-[#E5E5B2] transition-all duration-300"
                    >
                      <FaFileExport className="inline mr-2" /> Export
                    </button>
                  </div>
                  <p className="text-sm mb-2">March 25 - April 02</p>
                  <p className="text-3xl font-bold">Rs{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeSection === 'finance' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaDollarSign className="mr-2 text-[#2F4F4F]" /> Financial Records
              </h2>
              {financeError ? (
                <p className="text-red-600">{financeError}</p>
              ) : financialRecords.length === 0 && transactions.length === 0 ? (
                <p className="text-gray-600">No financial records or transactions available.</p>
              ) : (
                <div className="space-y-4">
                  {financialRecords.map((record) => (
                    <div key={record._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Type: {record.type}</p>
                      <p className="text-gray-600">Amount: Rs{record.amount.toLocaleString()}</p>
                      <p className="text-gray-600">Description: {record.description}</p>
                      <p className="text-gray-600">Date: {new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Type: Transaction (Revenue)</p>
                      <p className="text-gray-600">Customer: {transaction.customerName}</p>
                      <p className="text-gray-600">Email: {transaction.customerEmail}</p>
                      <p className="text-gray-600">Amount: Rs{transaction.totalAmount.toLocaleString()}</p>
                      <p className="text-gray-600">Date: {new Date(transaction.paymentDate).toLocaleDateString()}</p>
                      {transaction.items && transaction.items.length > 0 && (
                        <p className="text-gray-600">
                          Items: {transaction.items.map((item) => `${item.name} (Qty: ${item.quantity})`).join(', ')}
                        </p>
                      )}
                      {transaction.refunded && (
                        <p className="text-red-500">
                          Refunded: {transaction.refundReason} on{' '}
                          {new Date(transaction.refundDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
                      {campaign.checked ? (
                        <p className="text-green-600 font-semibold mt-2">Checked by Admin</p>
                      ) : (
                        <button
                          onClick={() => handleCheckCampaign(campaign._id)}
                          className="mt-2 w-full bg-[#2F4F4F] text-white py-2 rounded-lg hover:bg-[#1A3C34] transition-colors"
                        >
                          Check
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeSection === 'users' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaUsers className="mr-2 text-[#2F4F4F]" /> Employee Management
              </h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Create New Employee</h3>
                <form onSubmit={handleCreateEmployee} className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Department</label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Finance">Finance</option>
                      <option value="Reservation">Reservation</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Salary (Rs)</label>
                    <input
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                      className="w-full p-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F4F]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#2F4F4F] text-white py-2 rounded-lg hover:bg-[#1A3C34] transition-colors"
                  >
                    Create Employee
                  </button>
                </form>
              </div>
              <h3 className="text-lg font-semibold text-[#8B4513] mb-4">Existing Employees</h3>
              <div className="mb-4">
                <button
                  onClick={handleExportEmployeesCSV}
                  className="bg-[#2F4F4F] text-white py-2 px-4 rounded-lg hover:bg-[#1A3C34] transition-all duration-300"
                >
                  <FaFileExport className="inline mr-2" /> Export Employees
                </button>
              </div>
              {employees.length === 0 ? (
                <p className="text-gray-600">No employees available.</p>
              ) : (
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Name: {employee.name}</p>
                      <p className="text-gray-600">Email: {employee.email}</p>
                      <p className="text-gray-600">Department: {employee.department}</p>
                      <p className="text-gray-600">Salary: Rs{employee.salary.toLocaleString()}</p>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
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
        <footer className="bg-[#2F4F4F]/80 backdrop-blur-md text-white p-4 text-center">
          <p>© 2025 CampEase. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default AdminDashboard;