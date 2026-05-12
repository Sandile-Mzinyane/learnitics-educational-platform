import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useCourseStore = create((set) => ({
  courses: [],
  myCourses: [],
  currentCourse: null,
  
  setCourses: (courses) => set({ courses }),
  setMyCourses: (myCourses) => set({ myCourses }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
}));

export const useProgressStore = create((set) => ({
  progress: [],
  badges: [],
  
  setProgress: (progress) => set({ progress }),
  setBadges: (badges) => set({ badges }),
}));
