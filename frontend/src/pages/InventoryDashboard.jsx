// frontend/src/pages/InventoryDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaBars, FaTimes, FaBox, FaSignOutAlt, FaList, FaTools, FaBell, FaCampground, FaUserCircle, FaUndo, FaChartBar, FaDownload } from 'react-icons/fa';

// Import the background image
import campingBg from '../assets/camping-bg3.jpg';

function InventoryDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('add');
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  // State for return form
  const [returnProductId, setReturnProductId] = useState('');
  const [returnQuantity, setReturnQuantity] = useState('');
  const [returnError, setReturnError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        price: Number(price),
        image,
        category,
        stock: Number(stock),
        status: 'Available',
      };
      
      const addResponse = await api.post('/products', productData);
      console.log('Product added:', addResponse.data);

      const fetchResponse = await api.get('/products');
      setProducts(fetchResponse.data);
      
      setName('');
      setPrice('');
      setImage('');
      setCategory('');
      setStock('');
    } catch (err) {
      console.error('Error adding product:', err.response ? err.response.data : err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleMarkForMaintenance = async (productId) => {
    try {
      await api.put(`/products/${productId}`, { stock: products.find(p => p._id === productId).stock - 1 });
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error marking product for maintenance:', err);
    }
  };

  const handleReturnProduct = async (e) => {
    e.preventDefault();
    setReturnError('');
    try {
      if (!returnProductId || !returnQuantity || returnQuantity <= 0) {
        setReturnError('Please select a product and enter a valid quantity');
        return;
      }
      await api.post('/products/return', {
        productId: returnProductId,
        quantity: Number(returnQuantity),
      });
      const response = await api.get('/products');
      setProducts(response.data);
      setReturnProductId('');
      setReturnQuantity('');
    } catch (err) {
      console.error('Error returning product:', err);
      setReturnError(err.response?.data?.message || 'Failed to return product');
    }
  };

  const handleExportInventory = () => {
    const csvContent = [
      ['Name', 'Price (Rs/day)', 'Category', 'Stock', 'Status'],
      ...products.map(product => [
        product.name,
        product.price,
        product.category,
        product.stock,
        product.status || 'Available'
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory_report.csv';
    link.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    { name: 'Add Product', section: 'add', icon: <FaBox className="text-xl" /> },
    { name: 'View Products', section: 'view', icon: <FaList className="text-xl" /> },
    { name: 'Maintenance', section: 'maintenance', icon: <FaTools className="text-xl" /> },
    { name: 'Return Products', section: 'return', icon: <FaUndo className="text-xl" /> },
    { name: 'Reports', section: 'reports', icon: <FaChartBar className="text-xl" /> },
  ];

  // Get selected product for return form
  const selectedProduct = products.find((p) => p._id === returnProductId);

  return (
    <div
      className="flex min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${campingBg})`,
      }}
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
              <span className="text-xl font-bold tracking-wide">Inventory</span>
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
              <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
            </div>
            <FaBell className="text-[#8B4513] text-xl cursor-pointer hover:text-[#2F4F4F] transition-colors duration-300 animate-pulse-glow" />
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-4xl text-[#2F4F4F]" />
              <span className="text-[#8B4513] font-medium">Hi, {user?.name || 'Inventory Manager'}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeSection === 'add' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaBox className="mr-2 text-[#2F4F4F]" /> Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Price (Rs/day)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                <button type="submit" className="btn-camping w-full">
                  Add Product
                </button>
              </form>
            </div>
          )}

          {activeSection === 'view' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaList className="mr-2 text-[#2F4F4F]" /> Product Inventory
              </h2>
              {products.length === 0 ? (
                <p className="text-gray-600">No products available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
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
                        onClick={() => handleDeleteProduct(product._id)}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'maintenance' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaTools className="mr-2 text-[#2F4F4F]" /> Products for Maintenance
              </h2>
              {products.length === 0 ? (
                <p className="text-gray-600">No products available for maintenance.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
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
                      <button
                        onClick={() => handleMarkForMaintenance(product._id)}
                        className="mt-2 w-full bg-[#8B4513] text-white py-2 rounded-lg hover:bg-[#6F2E0F] transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        Mark for Maintenance
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'return' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaUndo className="mr-2 text-[#2F4F4F]" /> Return Products
              </h2>
              <form onSubmit={handleReturnProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Select Product</label>
                  <select
                    value={returnProductId}
                    onChange={(e) => setReturnProductId(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedProduct && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#8B4513] mb-2">Name</label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        disabled
                        className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-gray-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8B4513] mb-2">Price (Rs/day)</label>
                      <input
                        type="number"
                        value={selectedProduct.price}
                        disabled
                        className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-gray-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8B4513] mb-2">Image URL</label>
                      <input
                        type="text"
                        value={selectedProduct.image}
                        disabled
                        className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-gray-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8B4513] mb-2">Category</label>
                      <input
                        type="text"
                        value={selectedProduct.category}
                        disabled
                        className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-gray-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8B4513] mb-2">Current Stock</label>
                      <input
                        type="number"
                        value={selectedProduct.stock}
                        disabled
                        className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-gray-100 focus:outline-none"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-[#8B4513] mb-2">Return Quantity</label>
                  <input
                    type="number"
                    value={returnQuantity}
                    onChange={(e) => setReturnQuantity(e.target.value)}
                    min="1"
                    className="mt-1 block w-full px-4 py-2 border border-[#8B4513] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2F4F4F] transition-all duration-300"
                    required
                  />
                </div>
                {returnError && (
                  <p className="text-red-600 text-sm">{returnError}</p>
                )}
                <button type="submit" className="btn-camping w-full">
                  Return Product
                </button>
              </form>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="bg-[#F5F5DC]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl animate-bounce-in">
              <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 flex items-center">
                <FaChartBar className="mr-2 text-[#2F4F4F]" /> Inventory Reports
              </h2>
              <p className="text-gray-600 mb-4">Inventory reports will be available soon.</p>
              <button
                onClick={handleExportInventory}
                className="btn-camping w-full flex items-center justify-center space-x-2"
              >
                <FaDownload className="text-xl" />
                <span>Export Inventory</span>
              </button>
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

export default InventoryDashboard;