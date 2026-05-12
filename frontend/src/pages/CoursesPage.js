import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBook, FaUsers, FaClock, FaStar } from 'react-icons/fa';
import { coursesService } from '../services/api';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesService.getAll();
        const coursesData = response.data?.results || response.data || [];
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const courseCategories = [
    { key: 'all', label: 'All Courses' },
    { key: 'HCI', label: 'Human Computer Interaction' },
    { key: 'SE', label: 'Software Engineering' },
    { key: 'PM', label: 'Project Management' },
    { key: 'DV', label: 'Data Visualization' }
  ];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.course_type === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div
          className="text-white text-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          Loading courses...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-800 to-purple-900">
      {/* Navigation */}
      <motion.nav
        className="bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                className="text-white hover:text-blue-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaArrowLeft className="text-xl" />
              </motion.button>
              <h1 className="text-white text-xl font-bold">Courses</h1>
            </div>
            <div className="flex space-x-4">
              <motion.button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Our Courses
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover comprehensive courses in Human Computer Interaction, Software Engineering, Project Management, and Data Visualization
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {courseCategories.map((category) => (
            <motion.button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${
                selectedCategory === category.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <FaBook className="text-white text-lg" />
                </div>
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                  {course.difficulty_level}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                {course.title}
              </h3>

              <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-sm text-blue-200 mb-4">
                <div className="flex items-center space-x-1">
                  <FaUsers className="text-xs" />
                  <span>{course.total_modules} modules</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaClock className="text-xs" />
                  <span>{course.duration_weeks} weeks</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-white text-sm ml-1">4.8</span>
                </div>

                <motion.button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enroll Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCourses.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-blue-100 text-lg">No courses found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;