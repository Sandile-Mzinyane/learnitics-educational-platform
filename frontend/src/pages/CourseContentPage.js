import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaFileAlt, FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { coursesService } from '../services/api';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRes = await coursesService.getById(courseId);
        setCourse(courseRes.data);

        const modulesData = courseRes.data.modules || [];
        const chapterData = Array.from({ length: 6 }, (_, index) => {
          const module = modulesData[index] || null;
          return {
            id: module?.id || `chapter-${index + 1}`,
            title: `Chapter ${index + 1}`,
            description: module?.description || 'This chapter covers important course concepts.',
            lessons: module?.lessons || [
              {
                id: `chapter-${index + 1}-lesson-1`,
                title: module ? module.title : `Lesson for chapter ${index + 1}`,
                description: module ? module.description : 'Lesson content will be added soon.',
                content: module ? (module.lessons?.[0]?.content || 'Lesson content is available here.') : 'Lesson content is available here.',
                lesson_type: module?.lessons?.[0]?.lesson_type || 'text',
                duration_minutes: module?.lessons?.[0]?.duration_minutes || 10,
              },
            ],
            quiz: module?.quiz || null,
          };
        });

        setModules(chapterData);
        setSelectedModule(chapterData[0]);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

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
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-semibold">Back to Dashboard</span>
            </button>
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
        {/* Course Header */}
        {course && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 mb-8 shadow-lg"
          >
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-blue-100 mb-4">{course.description}</p>
            <div className="flex space-x-4 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">{course.course_type}</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">{course.difficulty_level}</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">{course.total_modules} Modules</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center space-x-2">
                <FaBook className="text-secondary" />
                <span>Chapters</span>
              </h2>
              <div className="space-y-2">
                {modules.map((module, idx) => (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedModule(module)}
                    className={`w-full text-left p-4 rounded-xl transition ${
                      selectedModule?.id === module.id
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{idx + 1}</span>
                      <div>
                        <p className="font-semibold line-clamp-2">{module.title}</p>
                        <p className={`text-xs ${selectedModule?.id === module.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {module.lessons?.length || 0} lessons
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedModule && (
              <div className="space-y-6">
                {/* Module Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-primary mb-4">{selectedModule.title}</h2>
                  <p className="text-gray-600 mb-6">{selectedModule.description}</p>
                  
                  {/* Lessons */}
                  {selectedModule.lessons && selectedModule.lessons.length > 0 && (
                    <div className="space-y-4 mb-8">
                      <h3 className="text-xl font-bold text-primary mb-4">Lessons</h3>
                      {selectedModule.lessons.map((lesson, idx) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-5 border-2 rounded-xl cursor-pointer transition ${
                            expandedChapter === lesson.id
                              ? 'border-secondary bg-blue-50'
                              : 'border-gray-200 hover:border-secondary'
                          }`}
                          onClick={() => setExpandedChapter(expandedChapter === lesson.id ? null : lesson.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <FaFileAlt className="text-secondary text-lg" />
                              <div>
                                <h4 className="font-semibold text-primary">{lesson.title}</h4>
                                <p className="text-sm text-gray-600">{lesson.description}</p>
                              </div>
                            </div>
                            {expandedChapter === lesson.id ? (
                              <FaChevronUp className="text-secondary text-lg" />
                            ) : (
                              <FaChevronDown className="text-secondary text-lg" />
                            )}
                          </div>
                          {expandedChapter === lesson.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 mb-4">{lesson.content}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <span className="bg-secondary text-white px-2 py-1 rounded">
                                    {lesson.lesson_type}
                                  </span>
                                  <span>{lesson.duration_minutes} minutes</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quiz Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4 flex items-center space-x-2">
                    <FaQuestionCircle className="text-secondary" />
                    <span>Chapter Quiz</span>
                  </h3>
                  {selectedModule.quiz ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 border-2 border-yellow-300 rounded-xl bg-yellow-50"
                    >
                      <h4 className="font-semibold text-primary mb-2">{selectedModule.quiz.title}</h4>
                      <p className="text-gray-600 mb-4">{selectedModule.quiz.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm">
                          <span className="text-gray-600">
                            Passing Score: <strong>{selectedModule.quiz.passing_score}%</strong>
                          </span>
                          <span className="text-gray-600">
                            Attempts: <strong>{selectedModule.quiz.max_attempts}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/quiz/${selectedModule.quiz.id}`)}
                          className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                        >
                          Start Quiz
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-12 text-center">
                      <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No quiz available for this chapter yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
