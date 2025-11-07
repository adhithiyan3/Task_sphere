import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-gray-800">
          TaskSphere
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
              <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;