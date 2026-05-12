import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaUsers, FaChartBar, FaPlus, FaEye, FaCog } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { coursesService, analyticsService } from '../services/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [myCourses, setMyCourses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const loadTeacherData = useCallback(async () => {
    try {
      // Get courses taught by this teacher
      let teacherCourses = [];
      try {
        const coursesResponse = await coursesService.getMyTaughtCourses();
        teacherCourses = (coursesResponse.data?.results || coursesResponse.data) || [];
      } catch (err) {
        console.warn('getMyTaughtCourses failed, using getAll as fallback:', err);
        const coursesResponse = await coursesService.getAll();
        const allCourses = (coursesResponse.data?.results || coursesResponse.data) || [];
        teacherCourses = allCourses.filter(course => course.instructor === user.id) || [];
      }
      setMyCourses(Array.isArray(teacherCourses) ? teacherCourses : []);

      // Get analytics for teacher's courses (non-critical, fail silently)
      if (teacherCourses.length > 0) {
        try {
          const analyticsPromises = teacherCourses.map(course =>
            analyticsService.getMetrics(course.id).catch(err => {
              console.warn(`Failed to load analytics for course ${course.id}:`, err);
              return { data: {} };
            })
          );
          const analyticsResults = await Promise.all(analyticsPromises);
          const combinedAnalytics = analyticsResults.reduce((acc, result, index) => {
            acc[teacherCourses[index].id] = result.data;
            return acc;
          }, {});
          setAnalytics(combinedAnalytics);
        } catch (err) {
          console.warn('Failed to load analytics:', err);
        }
      }
    } catch (error) {
      console.error('Failed to load teacher data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/dashboard');
      return;
    }
    loadTeacherData();
  }, [user, navigate, loadTeacherData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-xl">
                L
              </div>
              <span className="font-bold text-2xl">Learnatics</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Teacher Dashboard</span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-secondary hover:bg-blue-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.first_name || user?.username || 'Teacher'}!
          </h1>
          <p className="text-blue-100">Manage your courses and track student progress</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-secondary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-primary">{myCourses.length}</p>
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
                <p className="text-3xl font-bold text-green-600">
                  {myCourses.reduce((total, course) => total + (course.students_enrolled?.length || 0), 0)}
                </p>
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
                <p className="text-gray-600 text-sm">Avg Completion</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {myCourses.length > 0
                    ? Math.round(myCourses.reduce((total, course) =>
                        total + (analytics[course.id]?.average_completion_rate || 0), 0) / myCourses.length)
                    : 0}%
                </p>
              </div>
              <FaChartBar className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary">My Courses</h2>
            <button
              onClick={() => navigate('/teacher/create-course')}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              <FaPlus />
              <span>Create Course</span>
            </button>
          </div>

          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                >
                  <div className="h-40 bg-gradient-to-br from-primary to-secondary"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        {course.students_enrolled?.length || 0} students
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-secondary text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        <FaEye />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => navigate('/teacher/analytics')}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        <FaChartBar />
                        <span>Stats</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg hover:bg-gray-300 transition" onClick={() => alert('Course settings coming soon!')}>
                        <FaCog />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
              <button
                onClick={() => navigate('/teacher/create-course')}
                className="inline-flex items-center space-x-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                <FaPlus />
                <span>Create Your First Course</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/teacher/create-course')}
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-blue-50 transition"
            >
              <FaPlus className="text-2xl text-secondary" />
              <div className="text-left">
                <p className="font-semibold text-primary">Create Course</p>
                <p className="text-sm text-gray-600">Add new learning content</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/teacher/analytics')}
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <FaChartBar className="text-2xl text-green-500" />
              <div className="text-left">
                <p className="font-semibold text-primary">View Analytics</p>
                <p className="text-sm text-gray-600">Track student progress</p>
              </div>
            </button>
            <button
              onClick={() => alert('Student management feature coming soon!')}
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <FaUsers className="text-2xl text-purple-500" />
              <div className="text-left">
                <p className="font-semibold text-primary">Manage Students</p>
                <p className="text-sm text-gray-600">View enrolled students</p>
              </div>
            </button>
            <button
              onClick={() => alert('Course settings feature coming soon!')}
              className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition"
            >
              <FaCog className="text-2xl text-yellow-500" />
              <div className="text-left">
                <p className="font-semibold text-primary">Course Settings</p>
                <p className="text-sm text-gray-600">Configure your courses</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {myCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{course.title}</p>
                  <p className="text-sm text-gray-600">
                    {course.students_enrolled?.length || 0} students enrolled
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last updated</p>
                  <p className="text-sm font-semibold">
                    {new Date(course.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;