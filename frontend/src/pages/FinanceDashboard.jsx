// frontend/src/pages/FinanceDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaDollarSign, FaSignOutAlt, FaList, FaBell, FaExchangeAlt, FaFileAlt, FaUndo, FaUserCircle, FaCampground, FaWallet, FaFileExport, FaUndoAlt, FaChartBar } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [reportDate, setReportDate] = useState('');
  const [reportMonth, setReportMonth] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [filterType, setFilterType] = useState('All'); // State for filtering records

  // New States for Budget Allocation
  const [budgets, setBudgets] = useState([]);
  const [department, setDepartment] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetDescription, setBudgetDescription] = useState('');

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

    // Fetch budgets
    const fetchBudgets = async () => {
      try {
        const response = await api.get('/finance/budgets');
        setBudgets(response.data);
      } catch (err) {
        console.error('Error fetching budgets:', err);
      }
    };

    fetchRecords();
    fetchTransactions();
    fetchBudgets();
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

  const handleGenerateMonthlyReport = async () => {
    if (!reportMonth) {
      alert('Please select a month');
      return;
    }

    try {
      const response = await api.get(`/finance/monthly-report?month=${reportMonth}`);
      setMonthlyReport(response.data.transactions);
    } catch (err) {
      console.error('Error generating monthly report:', err);
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

  const handleExportMonthlyCSV = () => {
    if (monthlyReport.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Customer Name', 'Email', 'Total Amount', 'Payment Date', 'Items'];
    const csvRows = [
      headers.join(','),
      ...monthlyReport.map((transaction) => [
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
    a.setAttribute('download', `monthly-report-${reportMonth}.csv`);
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

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finance/budgets', {
        department,
        amount: Number(budgetAmount),
        description: budgetDescription,
        date: new Date(),
      });
      const response = await api.get('/finance/budgets');
      setBudgets(response.data);
      setDepartment('');
      setBudgetAmount('');
      setBudgetDescription('');
      alert('Budget allocated successfully');
    } catch (err) {
      console.error('Error adding budget:', err);
      alert('Failed to allocate budget');
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
    { name: 'Monthly Report', section: 'monthly-report', icon: <FaChartBar className="text-xl" /> },
    { name: 'Refunds', section: 'refunds', icon: <FaUndo className="text-xl" /> },
    { name: 'Budget Allocation', section: 'budget-allocation', icon: <FaWallet className="text-xl" /> }, // New section
  ];

  // Filter records based on selected type
  const filteredRecords = filterType === 'All' ? records : records.filter((record) => record.type === filterType);

  // Data for the bar chart
  const chartData = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Amount (Rs)',
        data: [
          monthlyReport.reduce((sum, t) => sum + t.totalAmount, 0),
          records
            .filter((r) => r.type === 'Expense' && new Date(r.date).toISOString().startsWith(reportMonth))
            .reduce((sum, r) => sum + r.amount, 0),
        ],
        backgroundColor: ['#2F4F4F', '#8B4513'],
        borderColor: ['#1A3C34', '#5A2D0C'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Financial Summary for ${reportMonth || 'Selected Month'}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (Rs)',
        },
      },
    },
  };

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
        className={`flex-1 flex flex-col transition-all duration-300 z-10 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
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
                  <button
                    onClick={handleExportCSV}
                    className="mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
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

          {/* Monthly Report Section */}
          {activeSection === 'monthly-report' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaChartBar className="mr-2 text-[#2F4F4F]" /> Monthly Revenue Summary Report
              </h2>
              <div className="flex space-x-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Select Month</label>
                  <input
                    type="month"
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                  />
                </div>
                <button onClick={handleGenerateMonthlyReport} className="btn-camping mt-6">
                  <FaFileExport className="inline mr-2" /> Generate Report
                </button>
                {monthlyReport.length > 0 && (
                  <button
                    onClick={handleExportMonthlyCSV}
                    className="mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Export to CSV
                  </button>
                )}
              </div>
              {monthlyReport.length === 0 ? (
                <p className="text-gray-600">No transactions for the selected month.</p>
              ) : (
                <>
                  {/* Bar Chart */}
                  <div className="mb-8">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                  {/* Transaction List */}
                  <div className="space-y-4">
                    {monthlyReport.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm"
                      >
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
                </>
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
                      <div
                        key={transaction._id}
                        className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm"
                      >
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

          {/* Budget Allocation Section */}
          {activeSection === 'budget-allocation' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaWallet className="mr-2 text-[#2F4F4F]" /> Budget Allocation
              </h2>
              <form onSubmit={handleAddBudget} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Amount (Rs)</label>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Description</label>
                  <textarea
                    value={budgetDescription}
                    onChange={(e) => setBudgetDescription(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <button type="submit" className="btn-camping w-full">
                  Allocate Budget
                </button>
              </form>
              {budgets.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-[#8B4513]">Allocated Budgets</h3>
                  {budgets.map((budget) => (
                    <div key={budget._id} className="border border-[#8B4513] p-4 rounded-lg bg-white shadow-sm">
                      <p className="text-gray-800 font-semibold">Department: {budget.department}</p>
                      <p className="text-gray-600">Amount: Rs{budget.amount}</p>
                      <p className="text-gray-600">Description: {budget.description}</p>
                      <p className="text-gray-600">Date: {new Date(budget.date).toLocaleDateString()}</p>
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