import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const SignupPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md"
      >
        {/* Back Button */}
        <Link to="/" className="flex items-center text-secondary hover:text-primary mb-8 transition">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-primary mb-2">Create Account</h1>
        <p className="text-gray-600 mb-8">Join Learnatics and start learning today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}


          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-3 text-secondary text-sm" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-3 text-secondary text-sm" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-3 text-secondary text-sm" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-3 text-secondary text-sm" />
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:text-primary transition">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
