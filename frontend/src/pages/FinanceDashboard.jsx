// frontend/src/pages/FinanceDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaDollarSign, FaSignOutAlt, FaList, FaBell, FaExchangeAlt, FaFileAlt, FaUndo, FaUserCircle, FaCampground, FaWallet, FaFileExport, FaUndoAlt } from 'react-icons/fa';

// Import the background image (assumed to be in assets)
import campingBg from '../assets/camping-bg.jpg'; // Adjust the path if necessary

function FinanceDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('add');
  const [records, setRecords] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dailyReport, setDailyReport] = useState([]);
  const [reportDate, setReportDate] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [filterType, setFilterType] = useState('All'); // State for filtering records

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/finance/records');
        setRecords(response.data);
      } catch (err) {
        console.error('Error fetching financial records:', err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await api.get('/finance/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchRecords();
    fetchTransactions();
  }, []);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finance/records', {
        type,
        amount: Number(amount),
        description,
        date: new Date(),
      });
      const response = await api.get('/finance/records');
      setRecords(response.data);
      setType('');
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error('Error adding financial record:', err);
    }
  };

  // Delete Financial Record Function
  const handleDeleteRecord = async (id) => {
    try {
      await api.delete(`/finance/records/${id}`);
      setRecords(records.filter((record) => record._id !== id));
    } catch (err) {
      console.error('Error deleting financial record:', err);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportDate) {
      alert('Please select a date');
      return;
    }

    try {
      const response = await api.get(`/finance/daily-report?date=${reportDate}`);
      setDailyReport(response.data);
    } catch (err) {
      console.error('Error generating daily report:', err);
      alert('Failed to generate report');
    }
  };

  const handleExportCSV = () => {
    if (dailyReport.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Customer Name', 'Email', 'Total Amount', 'Payment Date', 'Items'];
    const csvRows = [
      headers.join(','),
      ...dailyReport.map((transaction) => [
        transaction.customerName,
        transaction.customerEmail,
        transaction.totalAmount,
        new Date(transaction.paymentDate).toLocaleDateString(),
        transaction.items.map((item) => `${item.name} ($${item.price} x ${item.quantity})`).join('; '),
      ].join(',')),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `daily-report-${reportDate}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleProcessRefund = async (transactionId) => {
    if (!refundReason) {
      alert('Please select a refund reason');
      return;
    }

    try {
      await api.post(`/finance/refund/${transactionId}`, { reason: refundReason });
      alert('Refund processed successfully');
      const response = await api.get('/finance/transactions');
      setTransactions(response.data);
      setRefundReason('');
    } catch (err) {
      console.error('Error processing refund:', err);
      alert('Failed to process refund');
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
    { name: 'Add Record', section: 'add', icon: <FaDollarSign className="text-xl" /> },
    { name: 'View Records', section: 'view', icon: <FaList className="text-xl" /> },
    { name: 'Transactions', section: 'transactions', icon: <FaExchangeAlt className="text-xl" /> },
    { name: 'Daily Report', section: 'daily-report', icon: <FaFileAlt className="text-xl" /> },
    { name: 'Refunds', section: 'refunds', icon: <FaUndo className="text-xl" /> },
  ];

  // Filter records based on selected type
  const filteredRecords = filterType === 'All' ? records : records.filter((record) => record.type === filterType);

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
              <span className="text-xl font-bold tracking-wide">Finance</span>
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
              <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>
            <FaBell className="text-[#8B4513] text-xl cursor-pointer hover:text-[#2F4F4F] transition-colors duration-300 animate-pulse-glow" />
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-4xl text-[#2F4F4F]" />
              <span className="text-[#8B4513] font-medium">Hi, {user?.name || 'Finance Manager'}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Add Record Section */}
          {activeSection === 'add' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaWallet className="mr-2 text-[#2F4F4F]" /> Add Financial Record
              </h2>
              <form onSubmit={handleAddRecord} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Amount (Rs)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <button type="submit" className="btn-camping w-full">
                  Add Record
                </button>
              </form>
            </div>
          )}

          {/* View Records Section */}
          {activeSection === 'view' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaList className="mr-2 text-[#2F4F4F]" /> Financial Records
              </h2>
              {/* Filter Section */}
              <div className="flex space-x-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Filter by Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                  >
                    <option value="All">All</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
              </div>
              {filteredRecords.length === 0 ? (
                <p className="text-gray-600">No financial records available.</p>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Type: {record.type}</p>
                      <p className="text-gray-600">Amount: Rs.{record.amount}</p>
                      <p className="text-gray-600">Description: {record.description}</p>
                      <p className="text-gray-600">Date: {new Date(record.date).toLocaleDateString()}</p>
                      <button
                        onClick={() => handleDeleteRecord(record._id)}
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

          {/* Transactions Section */}
          {activeSection === 'transactions' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaExchangeAlt className="mr-2 text-[#2F4F4F]" /> Customer Transactions
              </h2>
              {transactions.length === 0 ? (
                <p className="text-gray-600">No transactions available.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-800 font-semibold">
                          Customer: {transaction.customerName}
                        </p>
                        <p className="text-gray-600">Email: {transaction.customerEmail}</p>
                      </div>
                      <p className="text-gray-600">
                        Date: {new Date(transaction.paymentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 font-semibold">
                        Total Cost: Rs{transaction.totalAmount.toFixed(2)}
                      </p>
                      <div className="mt-2">
                        <p className="text-gray-700 font-medium">Rented Products:</p>
                        <ul className="list-disc list-inside text-gray-600">
                          {transaction.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - Rs{item.price} x {item.quantity} = Rs
                              {(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {transaction.refunded && (
                        <p className="text-red-500 mt-2">
                          Refunded on {new Date(transaction.refundDate).toLocaleDateString()} - Reason:{' '}
                          {transaction.refundReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Daily Report Section */}
          {activeSection === 'daily-report' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaFileAlt className="mr-2 text-[#2F4F4F]" /> Daily Rental Income Report
              </h2>
              <div className="flex space-x-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Select Date</label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                  />
                </div>
                <button onClick={handleGenerateReport} className="btn-camping mt-6">
                  <FaFileExport className="inline mr-2" /> Generate Report
                </button>
                {dailyReport.length > 0 && (
                  <button onClick={handleExportCSV} className="mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                    Export to CSV
                  </button>
                )}
              </div>
              {dailyReport.length === 0 ? (
                <p className="text-gray-600">No transactions for the selected date.</p>
              ) : (
                <div className="space-y-4">
                  {dailyReport.map((transaction) => (
                    <div key={transaction._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-800 font-semibold">
                          Customer: {transaction.customerName}
                        </p>
                        <p className="text-gray-600">Email: {transaction.customerEmail}</p>
                      </div>
                      <p className="text-gray-600">
                        Date: {new Date(transaction.paymentDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 font-semibold">
                        Total Income: Rs{transaction.totalAmount.toFixed(2)}
                      </p>
                      <div className="mt-2">
                        <p className="text-gray-700 font-medium">Rented Products:</p>
                        <ul className="list-disc list-inside text-gray-600">
                          {transaction.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - Rs{item.price} x {item.quantity} = Rs
                              {(item.price * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Refunds Section */}
          {activeSection === 'refunds' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaUndoAlt className="mr-2 text-[#2F4F4F]" /> Process Refunds
              </h2>
              {transactions.length === 0 ? (
                <p className="text-gray-600">No transactions available for refund.</p>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter((transaction) => !transaction.refunded)
                    .map((transaction) => (
                      <div key={transaction._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-800 font-semibold">
                            Customer: {transaction.customerName}
                          </p>
                          <p className="text-gray-600">Email: {transaction.customerEmail}</p>
                        </div>
                        <p className="text-gray-600">
                          Date: {new Date(transaction.paymentDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 font-semibold">
                          Total Amount: Rs{transaction.totalAmount.toFixed(2)}
                        </p>
                        <div className="mt-2">
                          <p className="text-gray-700 font-medium">Rented Products:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {transaction.items.map((item, index) => (
                              <li key={index}>
                                {item.name} - Rs{item.price} x {item.quantity} = Rs
                                {(item.price * item.quantity).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <select
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            className="px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                          >
                            <option value="">Select Refund Reason</option>
                            <option value="Gear Damage">Gear Damage</option>
                            <option value="Rental Cancellation">Rental Cancellation</option>
                          </select>
                          <button
                            onClick={() => handleProcessRefund(transaction._id)}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                          >
                            Process Refund
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

export default FinanceDashboard;