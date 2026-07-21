import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminMenu from './components/admin/AdminMenu';
import MenuList from './components/menu/MenuList';


function App() {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4 flex gap-4 justify-center">
          <Link to="/login" className="text-white hover:text-blue-300">Login</Link>
          <Link to="/register" className="text-white hover:text-blue-300">Register</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<h1 className="text-center mt-10 text-3xl">Welcome to Food Ordering App! 🍔</h1>} />
          <Route path="/admin/menu" element={<AdminMenu/>}/>
          <Route path="/menu" element={<MenuList/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;