import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar, FaTrophy, FaClock, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { coursesService, progressService } from '../services/api';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [myCourses, setMyCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrolledRes, allRes, progressRes] = await Promise.all([
          coursesService.getMyCourses(),
          coursesService.getAll(),
          progressService.getMyProgress()
        ]);

        setMyCourses(enrolledRes.data || []);
        const availableResData = allRes.data || {};
        setAllCourses(Array.isArray(availableResData) ? availableResData : (availableResData.results || []));
        setProgress(progressRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalProgress = progress.length > 0 
    ? Math.round(progress.reduce((a, p) => a + p.percentage_completed, 0) / progress.length)
    : 0;
  
  const completedCourses = progress.filter(p => p.percentage_completed >= 100).length;
  const totalHours = myCourses.reduce((sum, course) => sum + (course.duration_weeks * 10), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-2">Your Analytics</h1>
          <p className="text-blue-100">Track your learning progress and achievements</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Progress</p>
                <p className="text-3xl font-bold text-primary">{totalProgress}%</p>
              </div>
              <FaChartBar className="text-4xl text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Courses</p>
                <p className="text-3xl font-bold text-green-600">{completedCourses}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Courses</p>
                <p className="text-3xl font-bold text-yellow-600">{myCourses.length}</p>
              </div>
              <FaTrophy className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Hours Studied</p>
                <p className="text-3xl font-bold text-blue-600">{totalHours}</p>
              </div>
              <FaClock className="text-4xl text-blue-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-6">Course Progress</h2>
          {allCourses.length > 0 ? (
            <div className="space-y-6">
              {allCourses.map((course, idx) => {
                const courseProgress = progress.find(p => p.course === course.id);
                const progressPercent = courseProgress?.percentage_completed || 0;
                const isEnrolled = myCourses.some(c => c.id === course.id);
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b pb-6 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.course_type} • {course.difficulty_level} • {isEnrolled ? 'Enrolled' : 'Not Enrolled'}</p>
                      </div>
                      <span className="text-lg font-bold text-primary">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No courses available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
