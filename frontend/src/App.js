import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminMenu from './components/admin/AdminMenu';
import MenuList from './components/menu/MenuList';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrderPage';
import AdminOrdersPage from './pages/AdmainOrdersPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminDashboard from './pages/AdminDashboard';
import FavoritesPage from './pages/FavoritesPage';

// React Query setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds — itna time data fresh rahega
      retry: 2,         // Fail hone pe 2 baar retry
      refetchOnWindowFocus: true, // Window focus pe refresh
    },
  },
});


function App() {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4 flex gap-4 justify-center">
          <Link to="/login" className="text-white hover:text-blue-300">Login</Link>
          <Link to="/register" className="text-white hover:text-blue-300">Register</Link>
          <Link to="/admin/dashboard" className="text-white hover:text-blue-300">Dashboard</Link>
          <Link to="/favorites" className="text-white hover:text-blue-300">Favorites ❤️</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<h1 className="text-center mt-10 text-3xl">Welcome to Food Ordering App! 🍔</h1>} />
          <Route path="/admin/menu" element={<AdminMenu/>}/>
          <Route path="/menu" element={<MenuList/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;