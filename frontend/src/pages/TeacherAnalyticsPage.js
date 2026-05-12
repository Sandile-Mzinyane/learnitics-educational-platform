import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartBar, FaUsers, FaBook, FaTrophy } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { coursesService, progressService } from '../services/api';

const TeacherAnalyticsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/teacher-dashboard');
      return;
    }
    loadAnalytics();
  }, [user, navigate]);

  const loadAnalytics = async () => {
    try {
      // Get teacher's courses
      const coursesResponse = await coursesService.getMyTaughtCourses();
      const teacherCourses = coursesResponse.data || [];

      setCourses(teacherCourses);

      // Get all progress data and filter for teacher's courses
      const progressResponse = await progressService.getMyProgress();
      const allProgress = progressResponse.data || [];

      // Group progress by course
      const analyticsData = {};
      teacherCourses.forEach(course => {
        analyticsData[course.id] = allProgress.filter(p => p.course === course.id) || [];
      });

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getCourseStats = (courseId) => {
    const progressData = analytics[courseId] || [];
    const enrolled = progressData.length;
    const completed = progressData.filter(p => p.percentage_completed >= 100).length;
    const avgProgress = enrolled > 0
      ? Math.round(progressData.reduce((sum, p) => sum + p.percentage_completed, 0) / enrolled)
      : 0;

    return { enrolled, completed, avgProgress };
  };

  const totalStudents = courses.reduce((sum, course) => sum + getCourseStats(course.id).enrolled, 0);
  const totalCompletions = courses.reduce((sum, course) => sum + getCourseStats(course.id).completed, 0);
  const avgCompletionRate = totalStudents > 0 ? Math.round((totalCompletions / totalStudents) * 100) : 0;

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-2">Course Analytics</h1>
          <p className="text-blue-100">Track student progress and engagement across your courses</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-secondary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-primary">{courses.length}</p>
              </div>
              <FaBook className="text-4xl text-secondary opacity-20" />
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
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
              </div>
              <FaUsers className="text-4xl text-green-500 opacity-20" />
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
                <p className="text-gray-600 text-sm">Completions</p>
                <p className="text-3xl font-bold text-yellow-600">{totalCompletions}</p>
              </div>
              <FaTrophy className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Completion</p>
                <p className="text-3xl font-bold text-purple-600">{avgCompletionRate}%</p>
              </div>
              <FaChartBar className="text-4xl text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Course Details */}
        <div className="space-y-6">
          {courses.map((course, idx) => {
            const stats = getCourseStats(course.id);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{course.title}</h3>
                    <p className="text-gray-600">{course.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Course Type</p>
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
                      {course.course_type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FaUsers className="text-2xl text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.enrolled}</p>
                    <p className="text-sm text-gray-600">Enrolled Students</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FaTrophy className="text-2xl text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    <p className="text-sm text-gray-600">Completions</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FaChartBar className="text-2xl text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</p>
                    <p className="text-sm text-gray-600">Avg Progress</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{stats.avgProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all"
                      style={{ width: `${stats.avgProgress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No courses found</p>
            <Link
              to="/teacher-dashboard"
              className="inline-flex items-center space-x-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAnalyticsPage;