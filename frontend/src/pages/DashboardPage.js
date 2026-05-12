import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaChartBar, FaBook, FaAward, FaFire, FaTrophy, FaStar, FaClock, FaUsers, FaLightbulb, FaRocket, FaCheckCircle, FaPlay, FaCalendar, FaBullseye, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { coursesService, progressService } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAchievements, setShowAchievements] = useState(false);

  // Mock data for advanced features
  const achievements = [
    { id: 1, title: "First Steps", description: "Completed your first lesson", icon: <FaPlay />, unlocked: true, color: "text-green-500" },
    { id: 2, title: "Week Warrior", description: "7 day learning streak", icon: <FaFire />, unlocked: true, color: "text-orange-500" },
    { id: 3, title: "Knowledge Seeker", description: "Completed 5 courses", icon: <FaTrophy />, unlocked: false, color: "text-yellow-500" },
    { id: 4, title: "Master Learner", description: "Achieved 95% average score", icon: <FaStar />, unlocked: false, color: "text-purple-500" }
  ];

  const recentActivities = [
    { id: 1, type: "lesson_completed", course: "Human Computer Interaction", lesson: "User Research Methods", time: "2 hours ago", icon: <FaCheckCircle />, color: "text-green-500" },
    { id: 2, type: "quiz_passed", course: "Software Engineering", score: "92%", time: "1 day ago", icon: <FaTrophy />, color: "text-yellow-500" },
    { id: 3, type: "course_enrolled", course: "Data Visualization", time: "3 days ago", icon: <FaBook />, color: "text-blue-500" },
    { id: 4, type: "streak_achieved", streak: "7 days", time: "1 week ago", icon: <FaFire />, color: "text-orange-500" }
  ];

  const studyGoals = [
    { id: 1, title: "Complete HCI Course", progress: 75, target: 100, deadline: "Dec 31, 2026", color: "bg-blue-500" },
    { id: 2, title: "Daily Learning", progress: 85, target: 100, deadline: "Weekly", color: "bg-green-500" },
    { id: 3, title: "Skill Assessment", progress: 60, target: 100, deadline: "Jan 15, 2027", color: "bg-purple-500" }
  ];

  useEffect(() => {
    // Route based on user role
    if (user?.role === 'teacher') {
      navigate('/teacher-dashboard');
      return;
    }
    if (user?.role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [enrolledRes, availableRes, progressRes] = await Promise.all([
          coursesService.getMyCourses(),
          coursesService.getAll(),
          progressService.getMyProgress()
        ]);

        // Handle paginated responses
        const enrolled = (enrolledRes.data?.results || enrolledRes.data) || [];
        const availableResData = (availableRes.data?.results || availableRes.data) || [];
        const progressData = (progressRes.data?.results || progressRes.data) || [];

        const enrolledIds = enrolled.map((course) => course.id);

        setMyCourses(Array.isArray(enrolled) ? enrolled : []);
        setAvailableCourses(Array.isArray(availableResData) ? availableResData.filter((course) => !enrolledIds.includes(course.id)) : []);
        setProgress(Array.isArray(progressData) ? progressData : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setMyCourses([]);
        setAvailableCourses([]);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id}/content`);
  };

  const handleEnroll = async (courseId) => {
    try {
      await coursesService.enroll(courseId);
      const enrolledRes = await coursesService.getMyCourses();
      const allCoursesRes = await coursesService.getAll();
      const enrolledIds = enrolledRes.data.map((course) => course.id);
      setMyCourses(enrolledRes.data || []);
      setAvailableCourses((allCoursesRes.data || []).filter((course) => !enrolledIds.includes(course.id)));
      navigate(`/course/${courseId}/content`);
    } catch (err) {
      console.error('Failed to enroll:', err);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  const handleContinueLearning = () => {
    navigate('/continue-learning');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  // Calculate advanced stats
  const stats = useMemo(() => {
    const activeCourseCount = Math.max(myCourses.length, 4);
    const averageProgress = progress.length > 0
      ? Math.round(progress.reduce((a, p) => a + p.percentage_completed, 0) / progress.length)
      : 59;
    const completedCoursesCount = progress.length > 0
      ? progress.filter((p) => p.percentage_completed >= 100).length
      : 1;
    const studyStreak = 7; // Mock data
    const totalStudyTime = 42; // Mock data in hours
    const certificatesEarned = completedCoursesCount;

    return {
      activeCourseCount,
      averageProgress,
      completedCoursesCount,
      studyStreak,
      totalStudyTime,
      certificatesEarned
    };
  }, [myCourses, progress]);

  const filteredCourses = availableCourses.filter(course => {
    if (selectedCategory === 'all') return true;
    return course.course_type === selectedCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <motion.div
          className="text-white text-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav
        className="bg-primary text-white shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                L
              </motion.div>
              <span className="font-bold text-2xl">Learnatics</span>
            </Link>
            <div className="flex items-center space-x-6">
              <motion.button
                onClick={() => setShowAchievements(!showAchievements)}
                className="relative px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrophy className="inline mr-2" />
                Achievements
                {achievements.filter(a => a.unlocked).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {achievements.filter(a => a.unlocked).length}
                  </span>
                )}
              </motion.button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-secondary hover:bg-blue-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <motion.div
              className="flex items-center space-x-4 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <FaFire className="text-orange-400 text-xl" />
                <span className="text-orange-300 font-semibold">{stats.studyStreak} Day Streak!</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-blue-300 text-xl" />
                <span className="text-blue-200">{stats.totalStudyTime}h This Week</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome back, {user?.first_name || user?.username || 'Learner'}!
            </motion.h1>

            <motion.p
              className="text-blue-100 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Continue your learning journey and master new skills
            </motion.p>

            {/* Quick Actions */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={handleContinueLearning}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket className="text-yellow-400" />
                <span>Continue Learning</span>
              </motion.button>
              <motion.button
                onClick={handleViewAnalytics}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChartLine className="text-green-400" />
                <span>View Progress</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements Modal */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAchievements(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">Your Achievements</h2>
                  <button
                    onClick={() => setShowAchievements(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-xl border-2 ${achievement.unlocked ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${achievement.unlocked ? achievement.color : 'text-gray-400'}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {!achievement.unlocked && (
                        <div className="mt-2 text-xs text-gray-500">🔒 Locked</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Active Courses",
              value: stats.activeCourseCount,
              icon: <FaBook />,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
              textColor: "text-blue-600"
            },
            {
              label: "Average Progress",
              value: `${stats.averageProgress}%`,
              icon: <FaChartBar />,
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-50",
              textColor: "text-green-600"
            },
            {
              label: "Completed Courses",
              value: stats.completedCoursesCount,
              icon: <FaTrophy />,
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-50",
              textColor: "text-yellow-600"
            },
            {
              label: "Study Streak",
              value: `${stats.studyStreak} days`,
              icon: <FaFire />,
              color: "from-orange-500 to-red-500",
              bgColor: "bg-orange-50",
              textColor: "text-orange-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 border-l-4 border-l-current shadow-lg hover:shadow-xl transition-shadow`}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`text-4xl ${stat.textColor} opacity-20`}>
                  {stat.icon}
                </div>
              </div>
              {/* Mini progress bar for visual appeal */}
              <div className="mt-4 w-full bg-white rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learning Goals Section */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <FaBullseye className="mr-3 text-blue-500" />
              Learning Goals
            </h2>
            <span className="text-sm text-gray-500">Track your progress</span>
          </div>
          <div className="space-y-4">
            {studyGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-full ${goal.color} flex items-center justify-center text-white`}>
                  <FaBullseye />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-primary">{goal.title}</h3>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${goal.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    ></motion.div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Due: {goal.deadline}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <FaClock className="mr-3 text-green-500" />
              Recent Activity
            </h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-primary font-medium">
                    {activity.type === 'lesson_completed' && `Completed "${activity.lesson}" in ${activity.course}`}
                    {activity.type === 'quiz_passed' && `Passed quiz in ${activity.course} with ${activity.score}`}
                    {activity.type === 'course_enrolled' && `Enrolled in ${activity.course}`}
                    {activity.type === 'streak_achieved' && `Achieved ${activity.streak} learning streak!`}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-secondary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Courses</p>
                <p className="text-3xl font-bold text-primary">{stats.activeCourseCount}</p>
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
                <p className="text-gray-600 text-sm">Average Progress</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.averageProgress}%
                </p>
              </div>
              <FaChartBar className="text-4xl text-green-500 opacity-20" />
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
                <p className="text-gray-600 text-sm">Completed Courses</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.completedCoursesCount}
                </p>
              </div>
              <FaAward className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Enhanced Course Discovery */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-primary flex items-center">
              <FaLightbulb className="mr-3 text-yellow-500" />
              Discover Courses
            </h2>
            <div className="flex space-x-2">
              {['all', 'HCI', 'SE', 'PM', 'ASE'].map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === 'all' ? 'All' :
                   category === 'HCI' ? 'HCI' :
                   category === 'SE' ? 'Software Eng' :
                   category === 'PM' ? 'Project Mgmt' : 'Advanced SE'}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.slice(0, 6).map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    course.course_type === 'HCI' ? 'from-blue-400 to-blue-600' :
                    course.course_type === 'SE' ? 'from-green-400 to-green-600' :
                    course.course_type === 'PM' ? 'from-purple-400 to-purple-600' :
                    'from-orange-400 to-red-500'
                  } flex items-center justify-center text-white font-bold text-lg`}>
                    {course.course_type === 'HCI' ? 'H' :
                     course.course_type === 'SE' ? 'S' :
                     course.course_type === 'PM' ? 'P' : 'A'}
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <motion.h3
                  className="text-xl font-bold text-primary mb-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {course.title}
                </motion.h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {course.description.substring(0, 100)}...
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <FaUsers className="mr-1" />
                    {Math.floor(Math.random() * 500) + 100} students
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {course.total_modules * 2}h
                  </span>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => handleEnroll(course.id)}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enroll Now
                  </motion.button>
                  <motion.button
                    onClick={() => handleCourseClick(course)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 shadow-lg relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <FaRocket className="mr-3 text-yellow-400" />
                Quick Actions
              </h2>
              <span className="text-blue-200 text-sm">Get started instantly</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: <FaBook className="text-2xl" />,
                  title: "Continue Learning",
                  description: "Resume your latest course",
                  action: handleContinueLearning,
                  color: "from-blue-400 to-blue-600",
                  bgColor: "bg-blue-500/20"
                },
                {
                  icon: <FaChartBar className="text-2xl" />,
                  title: "View Analytics",
                  description: "Check your progress",
                  action: handleViewAnalytics,
                  color: "from-green-400 to-green-600",
                  bgColor: "bg-green-500/20"
                },
                {
                  icon: <FaUsers className="text-2xl" />,
                  title: "Study Groups",
                  description: "Join learning communities",
                  action: () => navigate('/study-groups'),
                  color: "from-purple-400 to-purple-600",
                  bgColor: "bg-purple-500/20"
                },
                {
                  icon: <FaCalendar className="text-2xl" />,
                  title: "Schedule Study",
                  description: "Plan your learning sessions",
                  action: () => navigate('/schedule'),
                  color: "from-orange-400 to-red-500",
                  bgColor: "bg-orange-500/20"
                }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  className={`flex flex-col items-center space-y-3 p-6 ${action.bgColor} backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">{action.title}</p>
                    <p className="text-sm text-blue-100">{action.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DashboardPage;
