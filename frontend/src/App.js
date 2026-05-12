import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import CourseDetailView from './components/CourseDetailView';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ContinueLearningPage from './pages/ContinueLearningPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CourseContentPage from './pages/CourseContentPage';
import TeacherAnalyticsPage from './pages/TeacherAnalyticsPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import TeacherCreateCoursePage from './pages/TeacherCreateCoursePage';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/teacher-dashboard" element={isAuthenticated ? <TeacherDashboard /> : <Navigate to="/login" />} />
        <Route path="/teacher/create-course" element={isAuthenticated ? <TeacherCreateCoursePage /> : <Navigate to="/login" />} />
        <Route path="/teacher/analytics" element={isAuthenticated ? <TeacherAnalyticsPage /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/user-management" element={isAuthenticated ? <AdminUserManagementPage /> : <Navigate to="/login" />} />
        <Route path="/course/:courseId" element={isAuthenticated ? <CourseDetailView /> : <Navigate to="/login" />} />
        <Route path="/course/:courseId/content" element={isAuthenticated ? <CourseContentPage /> : <Navigate to="/login" />} />
        <Route path="/quiz/:quizId" element={isAuthenticated ? <QuizPage /> : <Navigate to="/login" />} />
        <Route path="/continue-learning" element={isAuthenticated ? <ContinueLearningPage /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
