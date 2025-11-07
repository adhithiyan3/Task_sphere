import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to TaskSphere</h1>
      <p className="text-lg text-gray-600 mb-8">The best place to manage your daily tasks.</p>
      <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
        Get Started
      </Link>
    </div>
  );
};

export default Home;