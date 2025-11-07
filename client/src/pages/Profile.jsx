import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setFormData({ name: data.name, email: data.email, password: '' });
      } catch (err) {
        setError('Failed to fetch profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Filter out empty password so we don't send it if not changed
    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) {
      dataToUpdate.password = formData.password;
    }

    try {
      await updateUserProfile(dataToUpdate);
      setMessage('Profile updated successfully!');
      alert('Profile updated successfully!');
      // Clear password field after successful submission
      setFormData({ ...formData, password: '' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Profile</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">New Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;