import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { coursesService } from '../services/api';

const TeacherCreateCoursePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_type: 'SE',
    difficulty_level: 'beginner',
    duration_weeks: 4,
    total_modules: 1,
    is_free: true,
    is_published: false,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'duration_weeks' || name === 'total_modules' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await coursesService.create(formData);
      setSuccessMessage('Course created successfully! 🎉');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        course_type: 'SE',
        difficulty_level: 'beginner',
        duration_weeks: 4,
        total_modules: 1,
        is_free: true,
        is_published: false,
      });

      // Redirect to teacher dashboard after 2 seconds
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to create course:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create course. Please try again.');
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
            <Link to="/teacher-dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
              <FaArrowLeft className="text-lg" />
              <span className="font-semibold">Back to Dashboard</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center space-x-3"
          >
            <FaCheckCircle className="text-2xl" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="text-sm">Redirecting to dashboard...</p>
            </div>
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
          <h1 className="text-4xl font-bold mb-2">Create New Course</h1>
          <p className="text-blue-100">Fill in the details below to create a new course for your students</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                placeholder="Enter course title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                placeholder="Enter course description"
              ></textarea>
            </div>

            {/* Grid Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Type *
                </label>
                <select
                  name="course_type"
                  value={formData.course_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                >
                  <option value="SE">Software Engineering</option>
                  <option value="HCI">Human Computer Interaction</option>
                  <option value="PM">Project Management</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficulty_level"
                  value={formData.difficulty_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Grid Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration Weeks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (weeks) *
                </label>
                <input
                  type="number"
                  name="duration_weeks"
                  value={formData.duration_weeks}
                  onChange={handleChange}
                  min="1"
                  max="52"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                />
              </div>

              {/* Total Modules */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Modules *
                </label>
                <input
                  type="number"
                  name="total_modules"
                  value={formData.total_modules}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_free"
                  checked={formData.is_free}
                  onChange={handleChange}
                  className="w-4 h-4 text-secondary rounded focus:ring-2 focus:ring-secondary"
                />
                <span className="text-sm font-medium text-gray-700">Free Course</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 text-secondary rounded focus:ring-2 focus:ring-secondary"
                />
                <span className="text-sm font-medium text-gray-700">Publish Now</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-secondary hover:bg-blue-600'
                }`}
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/teacher-dashboard')}
                className="flex-1 py-3 px-6 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherCreateCoursePage;
