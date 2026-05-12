import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaChartBar, FaCog, FaUserPlus, FaBookOpen } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { coursesService, usersService, quizzesService } from '../services/api';
import UserManagement from '../components/UserManagement';
import CourseManagement from '../components/CourseManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalAttempts: 0,
    averageScore: 0,
    courseDistribution: [],
    userRoleDistribution: []
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'users', 'courses', 'analytics', 'settings'

  const loadAdminData = useCallback(async () => {
    try {
      const [coursesResponse, usersResponse, attemptsResponse] = await Promise.all([
        coursesService.getAll(),
        usersService.getAll(),
        quizzesService.getAllAttempts()
      ]);

      // Handle paginated responses - extract results array if present
      const coursesList = (coursesResponse.data?.results || coursesResponse.data) || [];
      const usersList = (usersResponse.data?.results || usersResponse.data) || [];
      const attemptsList = (attemptsResponse.data?.results || attemptsResponse.data) || [];

      setRecentCourses(Array.isArray(coursesList) ? coursesList.slice(0, 5) : []);

      // Calculate course distribution by type
      const courseTypeDistribution = coursesList.reduce((acc, course) => {
        acc[course.course_type] = (acc[course.course_type] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(courseTypeDistribution).map(([type, count]) => ({
        name: type === 'HCI' ? 'Human Computer Interaction' :
              type === 'SE' ? 'Software Engineering' :
              type === 'PM' ? 'Project Management' :
              type === 'ASE' ? 'Advanced Software Engineering' : type,
        value: count,
        shortName: type
      }));

      const totalStudents = usersList.filter((user) => user.role === 'student').length;
      const totalTeachers = usersList.filter((user) => user.role === 'teacher').length;
      const totalAdmins = usersList.filter((user) => user.role === 'admin').length;
      const avgScore = attemptsList.length > 0
        ? Math.round(attemptsList.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / attemptsList.length)
        : 0;

      setStats({
        totalUsers: usersList.length,
        totalCourses: coursesList.length,
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalAttempts: attemptsList.length,
        averageScore: avgScore,
        courseDistribution: chartData,
        userRoleDistribution: [
          { name: 'Students', value: totalStudents, color: '#3B82F6' },
          { name: 'Teachers', value: totalTeachers, color: '#10B981' },
          { name: 'Admins', value: totalAdmins, color: '#F59E0B' }
        ]
      });
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        totalAttempts: 0,
        averageScore: 0,
        courseDistribution: [],
        userRoleDistribution: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadAdminData();
  }, [user, navigate, loadAdminData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddUser = () => {
    setCurrentView('users');
  };

  const handleManageCourses = () => {
    setCurrentView('courses');
  };

  const handleViewAnalytics = () => {
    setCurrentView('analytics');
  };

  const handleSystemSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (currentView === 'users') {
    return <UserManagement onClose={handleBackToDashboard} />;
  }

  if (currentView === 'courses') {
    return <CourseManagement onClose={handleBackToDashboard} />;
  }

  if (currentView === 'analytics') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-primary">Analytics Dashboard</h2>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalCourses}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Total Quiz Attempts</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalAttempts}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Students</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalStudents}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Teachers</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalTeachers}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-secondary">{stats.averageScore}%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4">Recent Courses</h3>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-primary">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.course_type}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {course.enrolled_students_count || 0} students
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-primary">System Settings</h2>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4">Application Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
              <input
                type="text"
                defaultValue="Leanatics"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Course Duration (weeks)</label>
              <input
                type="number"
                defaultValue="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Quiz Attempts</label>
              <input
                type="number"
                defaultValue="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Allow Student Registration</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={false}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Maintenance Mode</label>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Save Settings
            </button>
          </div>
        </div>
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
              <span className="text-sm">Admin Dashboard</span>
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
            Welcome back, {user?.first_name || user?.username || 'Administrator'}!
          </h1>
          <p className="text-blue-100">Manage the entire Learnatics platform</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-secondary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
              </div>
              <FaUsers className="text-4xl text-secondary opacity-20" />
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
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
              </div>
              <FaBook className="text-4xl text-green-500 opacity-20" />
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
                <p className="text-gray-600 text-sm">Active Students</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalStudents}</p>
              </div>
              <FaBookOpen className="text-4xl text-yellow-500 opacity-20" />
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
                <p className="text-gray-600 text-sm">Teachers</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalTeachers}</p>
              </div>
              <FaUserPlus className="text-4xl text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Course Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Course Distribution by Type</h2>
            {stats.courseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.courseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.shortName === 'HCI' ? '#3B82F6' :
                        entry.shortName === 'SE' ? '#10B981' :
                        entry.shortName === 'PM' ? '#F59E0B' :
                        entry.shortName === 'ASE' ? '#EF4444' : '#6B7280'
                      } />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No course data available
              </div>
            )}
          </motion.div>

          {/* User Role Distribution Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">User Role Distribution</h2>
            {stats.userRoleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.userRoleDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No user data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={handleAddUser} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-blue-50 transition">
              <FaUserPlus className="text-2xl text-secondary" />
              <div className="text-left">
                <p className="font-semibold text-primary">Add User</p>
                <p className="text-sm text-gray-600">Create new accounts</p>
              </div>
            </button>
            <button onClick={handleManageCourses} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-blue-50 transition">
              <FaBook className="text-2xl text-secondary" />
              <div className="text-left">
                <p className="font-semibold text-primary">Manage Courses</p>
                <p className="text-sm text-gray-600">Review and approve</p>
              </div>
            </button>
            <button onClick={handleViewAnalytics} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-blue-50 transition">
              <FaChartBar className="text-2xl text-secondary" />
              <div className="text-left">
                <p className="font-semibold text-primary">View Analytics</p>
                <p className="text-sm text-gray-600">Platform insights</p>
              </div>
            </button>
            <button onClick={handleSystemSettings} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-blue-50 transition">
              <FaCog className="text-2xl text-secondary" />
              <div className="text-left">
                <p className="font-semibold text-primary">System Settings</p>
                <p className="text-sm text-gray-600">Configure platform</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Recent Courses</h2>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                    {course.title.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{course.title}</p>
                    <p className="text-sm text-gray-600">
                      {course.students_enrolled?.length || 0} students • {course.difficulty_level}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    course.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                  <button className="text-primary hover:text-blue-600">
                    <FaCog />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
              <FaUsers className="text-4xl text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{stats.totalStudents}</p>
              <p className="text-gray-600">Students</p>
            </div>
            <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
              <FaUserPlus className="text-4xl text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.totalTeachers}</p>
              <p className="text-gray-600">Teachers</p>
            </div>
            <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
              <FaCog className="text-4xl text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{stats.totalAdmins}</p>
              <p className="text-gray-600">Admins</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;