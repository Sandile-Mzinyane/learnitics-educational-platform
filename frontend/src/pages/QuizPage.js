import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { quizzesService } from '../services/api';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmitQuiz = useCallback(async () => {
    setSubmitting(true);
    try {
      // Submit final answer if exists
      if (answers[questions[currentQuestion]?.id]) {
        await quizzesService.submitAnswer(attempt.id, {
          question_id: questions[currentQuestion].id,
          answer: answers[questions[currentQuestion].id]
        });
      }

      // Submit quiz
      const result = await quizzesService.submitQuiz(attempt.id);
      setAttempt(result.data);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  }, [attempt, answers, questions, currentQuestion]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizResponse = await quizzesService.getById(quizId);
        setQuiz(quizResponse.data);
        setQuestions(quizResponse.data.questions || []);

        // Start attempt
        const attemptResponse = await quizzesService.startAttempt(quizId);
        setAttempt(attemptResponse.data);

        if (quizResponse.data.is_timed) {
          setTimeLeft(quizResponse.data.time_limit_minutes * 60);
        }
      } catch (error) {
        console.error('Failed to load quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz?.is_timed && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, quiz, showResults, handleSubmitQuiz]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async () => {
    if (answers[questions[currentQuestion].id]) {
      try {
        await quizzesService.submitAnswer(attempt.id, {
          question_id: questions[currentQuestion].id,
          answer: answers[questions[currentQuestion].id]
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-2xl text-primary">Loading Quiz...</div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <h1 className="text-4xl font-bold text-primary mb-4">Quiz Completed!</h1>
            <div className="text-6xl mb-4">
              {attempt.passed ? (
                <FaCheck className="text-green-500 mx-auto" />
              ) : (
                <FaTimes className="text-red-500 mx-auto" />
              )}
            </div>
            <p className="text-2xl mb-2">Score: {attempt.score}/{attempt.total_points}</p>
            <p className="text-xl mb-4">Percentage: {attempt.percentage.toFixed(1)}%</p>
            <p className={`text-lg font-semibold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
              {attempt.passed ? 'Passed!' : 'Not Passed'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-primary"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-bold text-primary">{quiz?.title}</h1>
                <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
            </div>
            {quiz?.is_timed && (
              <div className="flex items-center text-red-600">
                <FaClock className="mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          {currentQ && (
            <>
              <h2 className="text-2xl font-bold text-primary mb-6">{currentQ.question_text}</h2>

              {currentQ.question_type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentQ.options.map((option) => (
                    <label key={option.id} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option.option_text}
                        checked={answers[currentQ.id] === option.option_text}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="text-primary"
                      />
                      <span>{option.option_text}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQ.question_type === 'true_false' && (
                <div className="space-y-3">
                  {['True', 'False'].map((option) => (
                    <label key={option} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={option}
                        checked={answers[currentQ.id] === option}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        className="text-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {(currentQ.question_type === 'fill_blank' || currentQ.question_type === 'essay') && (
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Enter your answer here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  rows={currentQ.question_type === 'essay' ? 6 : 3}
                />
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answers[currentQ?.id]}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting || !answers[currentQ?.id]}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;