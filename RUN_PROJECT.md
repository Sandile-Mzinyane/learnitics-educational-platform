# Learnatics - Complete Project Setup & Running Instructions

## 🚀 Quick Start - Running the Project

### Prerequisites
- Python 3.8+
- Node.js 14+
- pip and npm

### Step 1: Start Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (Windows)
.\.venv\Scripts\activate

# Or for Mac/Linux
source ../.venv/bin/activate

# Run migrations (if not already done)
python manage.py migrate

# Seed the database with courses
python manage.py seed_cause_courses

# Start the development server
python manage.py runserver
```

**Backend URL:** `http://127.0.0.1:8000`
**Backend API:** `http://127.0.0.1:8000/api`

### Step 2: Start Frontend Server

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the React app
npm start
```

**Frontend URL:** `http://localhost:3000`

---

## 📋 Project Structure Overview

### Backend (Django)
- `backend/` - Django REST framework API
  - `apps/users/` - User authentication & profiles
  - `apps/courses/` - Course management
  - `apps/quizzes/` - Quiz & question management
  - `apps/progress/` - Student progress tracking
  - `apps/analytics/` - Learning analytics

### Frontend (React)
- `frontend/src/`
  - `pages/` - Page components
  - `components/` - Reusable components
  - `services/` - API service layer
  - `store/` - Zustand state management

---

## 📚 Available Pages & Routes

### Student Dashboard
- **URL:** `http://localhost:3000/dashboard`
- **Features:**
  - Shows 4 active courses
  - Displays 59% average progress
  - Shows 1 completed course
  - Cards for HCI, Software Engineering, Project Management
  - Quick action buttons for Continue Learning and Analytics

### Continue Learning
- **URL:** `http://localhost:3000/continue-learning`
- **Features:**
  - Resume active courses
  - View progress percentage
  - Course details and time estimates

### View Analytics
- **URL:** `http://localhost:3000/analytics`
- **Features:**
  - Average progress tracking
  - Completed courses count
  - Active courses overview
  - Hours studied
  - Individual course progress bars

### Course Content Page
- **URL:** `http://localhost:3000/course/:courseId/content`
- **Features:**
  - Display 6 chapters/modules
  - Click to expand chapter content
  - View lessons with content
  - Take chapter quizzes
  - Progress tracking

### Teacher Dashboard
- **URL:** `http://localhost:3000/teacher-dashboard`
- **Features:**
  - View taught courses
  - Access analytics
  - View recent activities

### Create New Course (Teacher)
- **URL:** `http://localhost:3000/teacher/create-course`
- **Features:**
  - Fill course form
  - Set course type (SE, HCI, PM)
  - Set difficulty level
  - Create course button
  - Success message on completion
  - Auto-redirect to teacher dashboard

### Admin Dashboard
- **URL:** `http://localhost:3000/admin-dashboard`
- **Features:**
  - View system statistics
  - Manage platform
  - Quick action buttons

### User Management (Admin)
- **URL:** `http://localhost:3000/admin/user-management`
- **Features:**
  - Create new users
  - Assign roles (Student, Teacher, Admin)
  - View users table
  - Edit and delete users
  - Success notifications

---

## 🔐 Authentication & User Roles

### Login Page
- **URL:** `http://localhost:3000/login`
- **Default Test Users:**
  - Student: `student@test.com` / `password`
  - Teacher: `teacher@test.com` / `password`
  - Admin: `admin@test.com` / `password`

### Sign Up Page
- **URL:** `http://localhost:3000/signup`
- **Features:**
  - Create new account
  - Automatic profile creation

---

## 🎓 Course Data

### Seeded Courses
The following 3 courses are automatically seeded:

1. **Human Computer Interaction (HCI)**
   - 2 modules
   - 4 lessons total
   - 2 quizzes

2. **Software Engineering (SE)**
   - 2 modules
   - 4 lessons total
   - 2 quizzes

3. **Project Management (PM)**
   - 2 modules
   - 4 lessons total
   - 2 quizzes

### How to Access Courses
1. Login as a student
2. Go to Dashboard (`/dashboard`)
3. View "Cause Courses" section showing HCI, SE, PM cards
4. Click "Open" button to enroll and view course
5. Click "Continue" to start the course
6. Navigate chapters and take quizzes

---

## 🛠️ API Endpoints Summary

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `POST /api/users/logout/` - Logout user
- `GET /api/users/me/` - Get current user

### Courses
- `GET /api/courses/courses/` - Get all courses
- `GET /api/courses/courses/{id}/` - Get course details
- `POST /api/courses/courses/` - Create course
- `GET /api/courses/courses/my_courses/` - Get enrolled courses
- `POST /api/courses/courses/{id}/enroll/` - Enroll in course

### Progress
- `GET /api/progress/progress/my_progress/` - Get user progress

### Quizzes
- `GET /api/quizzes/quizzes/` - Get all quizzes
- `POST /api/quizzes/quizzes/{id}/start_attempt/` - Start quiz

---

## 🧪 Testing the Project

### Test Student Flow
1. Open `http://localhost:3000`
2. Click "Sign Up" and create a student account
3. Login with the account
4. View dashboard with 4 courses
5. Click a cause course card
6. View course content with chapters
7. Click a chapter to expand
8. Take the quiz
9. View analytics

### Test Teacher Flow
1. Create a teacher account during signup
2. Go to `/teacher-dashboard`
3. Click "Create Course" button
4. Fill in course details:
   - Title
   - Description
   - Course Type
   - Difficulty Level
   - Duration
   - Modules count
5. Click "Create Course"
6. See success message
7. Redirected to teacher dashboard
8. Course appears in "My Courses"

### Test Admin Flow
1. Create an admin account
2. Go to `/admin-dashboard`
3. View system statistics
4. Click "Add User" button
5. Go to `/admin/user-management`
6. Fill in user form:
   - Username
   - Email
   - First/Last Name
   - Password
   - Role
7. Click "Create User"
8. User appears in the table below
9. Can delete users with delete button

---

## 📊 Data Models

### User
- Username, Email, First Name, Last Name
- Role: Student, Teacher, Admin
- Auto-created UserProfile on signup

### Course
- Title, Description
- Course Type: HCI, SE, PM
- Difficulty Level: Beginner, Intermediate, Advanced
- Published/Draft status
- Free course option

### Module
- Title, Description
- Order/Sequence
- Locked/Unlocked status
- Contains multiple lessons

### Lesson
- Title, Description, Content
- Lesson Type: text, video, interactive
- Duration in minutes
- Order/Sequence

### Quiz
- Title, Description
- Passing Score (%)
- Time Limit
- Max Attempts
- Contains multiple questions

### Question
- Question Text
- Question Type: Multiple Choice
- Correct Answer
- Options with is_correct flag
- Points, Difficulty

### Progress
- Student ID, Course ID
- Percentage Completed (0-100%)
- Last Accessed Date

---

## 🐛 Troubleshooting

### Backend Issues

**Django not found:**
```bash
# Ensure virtual environment is activated
.\.venv\Scripts\activate
pip install -r requirements.txt
```

**Database errors:**
```bash
# Reset database
python manage.py flush
python manage.py migrate
python manage.py seed_cause_courses
```

### Frontend Issues

**Port already in use:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Dependencies missing:**
```bash
npm install
```

**React build issues:**
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

---

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🎯 Key Features Implemented

✅ Student Dashboard with mock stats (4 courses, 59% progress, 1 completed)
✅ Cause Course Cards (HCI, SE, PM) clickable navigation
✅ Course Content Pages with 6 chapters
✅ Expandable chapter lessons
✅ Quiz integration per chapter
✅ Continue Learning page
✅ Analytics/Progress tracking page
✅ Teacher Create Course with success messaging
✅ Admin User Management with create/delete
✅ Recent Activities display
✅ Role-based routing (Student, Teacher, Admin)
✅ Beautiful Tailwind CSS styling
✅ Smooth animations with Framer Motion
✅ Responsive design for all devices

---

## 📝 Notes

- All course and module data is seeded automatically
- Student progress is calculated from quiz attempts
- Admin can create users but they need to complete signup
- Teachers can only create courses (not manage other teachers' courses)
- Students automatically get UserProfile on signup
- Quiz answers are tracked for analytics

---

## 🔗 Quick Links

| Page | URL | Role |
|------|-----|------|
| Landing | `http://localhost:3000/` | Public |
| Login | `http://localhost:3000/login` | Public |
| Signup | `http://localhost:3000/signup` | Public |
| Dashboard | `http://localhost:3000/dashboard` | Student |
| Continue Learning | `http://localhost:3000/continue-learning` | Student |
| Analytics | `http://localhost:3000/analytics` | Student |
| Course Content | `http://localhost:3000/course/:id/content` | Student |
| Teacher Dashboard | `http://localhost:3000/teacher-dashboard` | Teacher |
| Create Course | `http://localhost:3000/teacher/create-course` | Teacher |
| Admin Dashboard | `http://localhost:3000/admin-dashboard` | Admin |
| User Management | `http://localhost:3000/admin/user-management` | Admin |
| Quiz | `http://localhost:3000/quiz/:id` | Student |

---

**Last Updated:** May 6, 2026
**Version:** 1.0.0
