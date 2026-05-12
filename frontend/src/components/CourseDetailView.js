import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlay, FaQuestionCircle } from 'react-icons/fa';
import { coursesService, quizzesService, progressService } from '../services/api';

const CourseDetailView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const loadCourseData = useCallback(async () => {
    try {
      const courseResponse = await coursesService.getById(courseId);
      setCourse(courseResponse.data);

      try {
        const progressResponse = await progressService.getMyProgress();
        const courseProgress = progressResponse.data.find(p => p.course === parseInt(courseId));
        if (courseProgress) {
          setProgress(courseProgress);
        }
      } catch (err) {
        console.warn('Failed to load progress:', err);
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  const handleLessonClick = (lesson) => {
    alert(`Playing lesson: ${lesson.title}`);
  };

  const handleQuizClick = async (moduleId) => {
    try {
      const quizResponse = await quizzesService.getByModule(moduleId);
      if (quizResponse.data && quizResponse.data.length > 0) {
        const quiz = quizResponse.data[0];
        navigate(`/quiz/${quiz.id}`);
      } else {
        alert('No quiz available for this module yet.');
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert('Failed to start quiz. Please try again.');
    }
  };

  const handleEnroll = async () => {
    try {
      await coursesService.enroll(course.id);
      await loadCourseData();
      alert('You are now enrolled.');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll in the course. Please try again.');
    }
  };

  const handleQuizSubmit = async () => {
    if (!currentQuiz) return;

    try {
      await quizzesService.submitQuiz(currentQuiz.attempt.id);
      alert('Quiz submitted successfully!');
      setCurrentQuiz(null);
      loadCourseData(); // Refresh progress
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-white text-2xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Course not found</div>
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
              className="flex items-center space-x-2 text-white hover:text-blue-200 transition"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold">{course.title}</h1>
              <p className="text-sm text-blue-200">{course.course_type} • {course.difficulty_level}</p>
            </div>
            <div className="w-24"></div> {/* Spacer */}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Your Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-semibold text-primary">
                {progress.percentage_completed || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                style={{ width: `${progress.percentage_completed || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate(`/course/${course.id}/content`)}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
            >
              View Course Content
            </button>
            {!course.is_enrolled && (
              <button
                onClick={handleEnroll}
                className="w-full bg-secondary text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Enroll in Course
              </button>
            )}
          </div>
        </motion.div>

        {/* Modules */}
        <div className="space-y-6">
          {course.modules && course.modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <h3 className="text-xl font-bold">{module.title}</h3>
                <p className="text-blue-100">Module {module.order}</p>
              </div>

              <div className="p-6">
                {/* Lessons */}
                {module.lessons && module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <FaPlay size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{lesson.title}</p>
                        <p className="text-sm text-gray-600">{lesson.lesson_type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLessonClick(lesson)}
                      className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      <FaPlay size={12} />
                      <span>Watch</span>
                    </button>
                  </div>
                ))}

                {/* Quiz */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaQuestionCircle className="text-2xl text-yellow-500" />
                      <div>
                        <p className="font-semibold text-primary">Module Quiz</p>
                        <p className="text-sm text-gray-600">Test your knowledge</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuizClick(module.id)}
                      className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
                    >
                      <FaQuestionCircle size={16} />
                      <span>Take Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quiz Modal */}
        {currentQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-primary">Quiz: {currentQuiz.quiz.title}</h2>
              </div>

              <div className="p-6">
                <div className="text-center py-12">
                  <FaQuestionCircle className="text-6xl text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">Quiz Started!</h3>
                  <p className="text-gray-600 mb-6">
                    You have started the quiz. In a full implementation, you would see questions here.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleQuizSubmit}
                      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                      Submit Quiz
                    </button>
                    <button
                      onClick={() => setCurrentQuiz(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailView;