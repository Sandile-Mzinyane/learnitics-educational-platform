import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (data) => apiClient.post('/users/register/', data),
  login: (data) => apiClient.post('/users/login/', data),
  logout: () => apiClient.post('/users/logout/'),
  getCurrentUser: () => apiClient.get('/users/me/'),
};

export const usersService = {
  getAll: () => apiClient.get('/users/'),
  getById: (id) => apiClient.get(`/users/${id}/`),
  create: (data) => apiClient.post('/users/register/', data),
  register: (data) => apiClient.post('/users/register/', data),
  update: (id, data) => apiClient.put(`/users/${id}/`, data),
  delete: (id) => apiClient.delete(`/users/${id}/`),
};

export const coursesService = {
  getAll: () => apiClient.get('/courses/courses/'),
  getById: (id) => apiClient.get(`/courses/courses/${id}/`),
  create: (data) => apiClient.post('/courses/courses/', data),
  update: (id, data) => apiClient.put(`/courses/courses/${id}/`, data),
  delete: (id) => apiClient.delete(`/courses/courses/${id}/`),
  enroll: (id) => apiClient.post(`/courses/courses/${id}/enroll/`),
  getMyCourses: () => apiClient.get('/courses/courses/my_courses/'),
  getMyTaughtCourses: () => apiClient.get('/courses/courses/my_taught_courses/'),
  getCourseModules: (courseId) => apiClient.get(`/courses/courses/${courseId}/modules/`),
};

export const quizzesService = {
  getAll: () => apiClient.get('/quizzes/quizzes/'),
  getById: (id) => apiClient.get(`/quizzes/quizzes/${id}/`),
  getByModule: (moduleId) => apiClient.get('/quizzes/quizzes/', { params: { module: moduleId } }),
  startAttempt: (quizId) => apiClient.post(`/quizzes/quizzes/${quizId}/start_attempt/`),
  submitAnswer: (attemptId, data) => apiClient.post(`/quizzes/attempts/${attemptId}/submit_answer/`, data),
  submitQuiz: (attemptId) => apiClient.post(`/quizzes/attempts/${attemptId}/submit_quiz/`),
  getAllAttempts: () => apiClient.get('/quizzes/attempts/'),
};

export const progressService = {
  getMyProgress: () => apiClient.get('/progress/progress/my_progress/'),
  getProgress: (id) => apiClient.get(`/progress/progress/${id}/`),
};

export const analyticsService = {
  getMetrics: (courseId) => apiClient.get('/analytics/metrics/', { params: { course_id: courseId } }),
  getHeatmaps: (courseId) => apiClient.get('/analytics/heatmaps/', { params: { course: courseId } }),
  getMyProfile: () => apiClient.get('/analytics/strength-weakness/my_profile/'),
};

export default apiClient;
