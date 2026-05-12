import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaQuestionCircle, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { coursesService, progressService } from '../services/api';

const ContinueLearningPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [myCourses, setMyCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrolledRes, progressRes] = await Promise.all([
          coursesService.getMyCourses(),
          progressService.getMyProgress()
        ]);

        setMyCourses(enrolledRes.data || []);
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

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
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
          <h1 className="text-4xl font-bold mb-2">Continue Learning</h1>
          <p className="text-blue-100">Resume where you left off with content and quizzes</p>
        </motion.div>

        {/* Courses with Modules */}
        {myCourses.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Your Active Courses</h2>
            <div className="space-y-6">
              {myCourses.map((course, idx) => {
                const courseProgress = progress.find(p => p.course === course.id);
                const progressPercent = courseProgress?.percentage_completed || 0;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{course.title}</h3>
                          <p className="text-blue-100">{course.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Progress: {progressPercent}%</p>
                          <button
                            onClick={() => toggleCourseExpansion(course.id)}
                            className="mt-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                          >
                            {expandedCourse === course.id ? 'Collapse' : 'Expand Modules'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedCourse === course.id && (
                      <div className="p-6">
                        {course.modules && course.modules.length > 0 ? (
                          <div className="space-y-4">
                            {course.modules.map((module, moduleIdx) => (
                              <div key={module.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-lg font-semibold text-primary">{module.title}</h4>
                                  <span className="text-sm text-gray-600">Module {moduleIdx + 1}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{module.description}</p>

                                {/* Lessons */}
                                {module.lessons && module.lessons.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-primary mb-2">Lessons:</h5>
                                    <div className="space-y-2">
                                      {module.lessons.map((lesson) => (
                                        <div key={lesson.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                          <FaFileAlt className="text-secondary" />
                                          <div className="flex-1">
                                            <p className="font-medium text-primary">{lesson.title}</p>
                                            <p className="text-sm text-gray-600">{lesson.description}</p>
                                          </div>
                                          <button
                                            onClick={() => navigate(`/course/${course.id}/content`)}
                                            className="px-3 py-1 bg-secondary text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                          >
                                            View Content
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Quiz */}
                                {module.quiz && (
                                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <FaQuestionCircle className="text-yellow-500" />
                                      <div>
                                        <p className="font-medium text-primary">{module.quiz.title}</p>
                                        <p className="text-sm text-gray-600">Test your knowledge</p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => navigate(`/quiz/${module.quiz.id}`)}
                                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                    >
                                      Take Quiz
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No modules available yet.</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4 text-lg">No active courses yet</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-secondary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              <span>Explore Courses</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinueLearningPage;
