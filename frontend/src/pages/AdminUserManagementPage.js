import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { usersService } from '../services/api';

const AdminUserManagementPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'student',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await usersService.getAll();
        setUsers(response.data || []);
      } catch (err) {
        console.error('Failed to load users:', err);
        setErrorMessage('Unable to load users. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...formData,
        password2: formData.password,
      };
      const response = await usersService.register(payload);
      const newUser = response.data?.user;
      if (newUser) {
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setSuccessMessage(`User "${newUser.username}" created successfully! ✓`);
      } else {
        setSuccessMessage('User created successfully! ✓');
      }

      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'student',
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to create user:', error);
      setErrorMessage(error.response?.data?.detail || error.response?.data || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await usersService.delete(userId);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      setSuccessMessage('User deleted successfully');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      console.error('Failed to delete user:', error);
      setErrorMessage('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/admin-dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
              <FaArrowLeft className="text-lg" />
              <span className="font-semibold">Back to Admin Dashboard</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-xl">
                L
              </div>
              <span className="font-bold text-2xl">Learnatics</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg bg-secondary hover:bg-blue-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6"
          >
            <p className="font-semibold">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6"
          >
            <p className="font-semibold">{errorMessage}</p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-blue-100">Create and manage system users</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center space-x-2">
                <FaPlus className="text-secondary" />
                <span>Create User</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                    placeholder="Username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                    placeholder="First Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                    placeholder="Last Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                    placeholder="Password"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition text-sm ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-secondary hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center space-x-2">
                <FaUser className="text-secondary" />
                <span>Users ({users.length})</span>
              </h2>

              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem, idx) => (
                        <motion.tr
                          key={userItem.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{userItem.username}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{userItem.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {userItem.first_name} {userItem.last_name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              userItem.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : userItem.role === 'teacher'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(userItem.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No users yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
