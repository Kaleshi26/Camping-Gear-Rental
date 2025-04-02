// frontend/src/App.jsx
import React from 'react'; // Add this import
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loading from './components/Loading';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import InventoryDashboard from './pages/InventoryDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import RentalDashboard from './pages/RentalDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutWrapper from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

import AboutUs from "./pages/aboutus";
import FAQ from "./pages/FAQ";
import Reviews from "./pages/reviews";
import PartnershipForm from "./pages/PartnershipForm";
import Offers from "./pages/offers";
import Blog from './pages/Blog'; // Added Blog import
import ForgotPassword from './pages/ForgotPassword'; // Added ForgotPassword import

function Layout() {
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();

  // Detect navigation changes to show the loading screen
  React.useEffect(() => {
    // Show loading screen on navigation start
    setIsLoading(true);

    // Simulate the loading delay (e.g., 0.5 seconds or until the page loads)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust this delay to match your actual loading time

    // Cleanup the timer on unmount or location change
    return () => clearTimeout(timer);
  }, [location, setIsLoading]);

  // List of dashboard routes that should NOT have header and footer
  const dashboardRoutes = [
    "/inventory-dashboard",
    "/finance-dashboard",
    "/rental-dashboard",
    "/marketing-dashboard",
    "/admin-dashboard",
  ];

  // Check if the current path is in the dashboardRoutes array
  const isDashboard = dashboardRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show the loading screen when isLoading is true */}
      {isLoading && <Loading />}
      
      {!isDashboard && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gear" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/new-arrivals" element={<Products />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/blog" element={<Blog />} /> {/* Added Blog route */}
        
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutWrapper />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route path="/finance-dashboard" element={<FinanceDashboard />} />
          <Route path="/rental-dashboard" element={<RentalDashboard />} />
          <Route path="/marketing-dashboard" element={<MarketingDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* New project routes */}
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/partnership-request" element={<PartnershipForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Added ForgotPassword route */}
        </Routes>
      </main>
      {!isDashboard && <Footer />}

      {/* Keep ToastContainer here so it works across the app */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LoadingProvider>
          <Layout />
        </LoadingProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;