// frontend/src/pages/GearHostDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function GearHostDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if user is authenticated and has the correct role
    if (!user) {
      navigate('/signin');
    } else if (user.role !== 'gear_host') {
      // Redirect based on role
      switch (user.role) {
        case 'customer':
          navigate('/');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'inventory_manager':
          navigate('/inventory-dashboard');
          break;
        case 'finance_manager':
          navigate('/finance-dashboard');
          break;
        case 'rental_manager':
          navigate('/rental-dashboard');
          break;
        case 'marketing_manager':
          navigate('/marketing-dashboard');
          break;
        default:
          navigate('/signin');
      }
    }
  }, [user, navigate]);

  // Prevent navigation to other pages by disabling the links for now
  const handleNavigation = (path) => {
    alert('Gear Hosts can only view their dashboard. Contact an admin for more actions.');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Gear Host Dashboard</h2>
          <ul>
            <li
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation('/gearhost/my-gears')}
            >
              My Gears
            </li>
            <li
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation('/gearhost/earnings')}
            >
              Earnings
            </li>
            <li
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNavigation('/gearhost/complaints')}
            >
              Complaints
            </li>
          </ul>
        </div>
        <button
          onClick={logout}
          className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-5">
        <h1 className="text-2xl font-bold">Welcome to Gear Host Dashboard</h1>
        <p>Manage your gears, track earnings, and handle customer complaints.</p>
        <p className="mt-4 text-gray-600">
          Note: As a Gear Host, you can only view your dashboard. For any changes or actions, please contact an admin or manager.
        </p>
      </main>
    </div>
  );
}

export default GearHostDashboard;