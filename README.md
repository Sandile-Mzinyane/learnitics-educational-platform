# Learnatics - Professional Learning Platform

A comprehensive, AI-powered educational platform designed to transform student learning experiences.

## Project Overview

Learnatics addresses critical inefficiencies in current education systems:
- ✅ **Mastery-Based Progression**: Students must achieve ≥80% to unlock next module
- ✅ **Smart Assessments**: Automated quiz & assessment engine with instant feedback
- ✅ **Personalized Dashboards**: Real-time progress tracking and recommendations
- ✅ **Educator Analytics**: Visual dashboards for performance monitoring
- ✅ **Offline Learning**: PWA support for offline access
- ✅ **Gamification**: Badges and achievements for motivation
- ✅ **Accessibility**: Screen readers, keyboard navigation, high-contrast modes

## Tech Stack

### Backend
- **Framework**: Django 4.2 with Django REST Framework
- **Database**: SQLite
- **Authentication**: Token-based with role-based access control
- **Key Packages**: 
  - djangorestframework
  - django-cors-headers
  - Pillow (Image handling)
  - drf-spectacular (API documentation)

### Frontend
- **Framework**: React 18 with React Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Charts**: Recharts

## Project Structure

```
Leanatics/
├── backend/
│   ├── learnatics/                 # Django project settings
│   ├── apps/
│   │   ├── users/               # User authentication & profiles
│   │   ├── courses/             # Course content management
│   │   ├── quizzes/             # Assessment engine
│   │   ├── progress/            # Progress tracking & badges
│   │   └── analytics/           # Performance analytics
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API services
│   │   ├── store/               # Zustand store
│   │   ├── assets/              # Static files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── docs/                         # Documentation
```

## Courses Offered

1. **Human Computer Interaction** - User-centered design principles
2. **Software Engineering** - Professional development practices
3. **Project Management** - Team leadership and delivery
4. **Data Visualization** - Transform data into insights

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/me/` - Get current user

### Courses
- `GET /api/courses/courses/` - List all courses
- `GET /api/courses/courses/{id}/` - Get course details
- `POST /api/courses/courses/{id}/enroll/` - Enroll in course

### Quizzes
- `GET /api/quizzes/quizzes/` - List quizzes
- `POST /api/quizzes/quizzes/{id}/start_attempt/` - Start quiz
- `POST /api/quizzes/attempts/{id}/submit_answer/` - Submit answer
- `POST /api/quizzes/attempts/{id}/submit_quiz/` - Submit quiz

### Progress
- `GET /api/progress/progress/` - Get student progress
- `GET /api/progress/progress/my_progress/` - Get my progress

### Analytics
- `GET /api/analytics/metrics/` - Course metrics
- `GET /api/analytics/heatmaps/` - Performance heatmaps
- `GET /api/analytics/strength-weakness/my_profile/` - Student profile

## Key Features Implementation

### 1. Mastery-Based Progression
- Quiz passing score: 80%
- Locked modules until previous module is passed
- Clear progression visualization

### 2. Real-time Analytics
- Student performance tracking
- Heatmap visualization of difficult topics
- Class-wide analytics for educators
- Individual strength/weakness profiles

### 3. Responsive Design
- Mobile-first approach
- Optimized for low-spec devices
- Touch-friendly interface
- Previous/Back navigation throughout

### 4. User Roles
- **Student**: Access courses, take quizzes, track progress
- **Teacher**: Monitor student performance, view analytics
- **Admin**: Manage content, users, and platform settings

## Color Scheme

- **Primary**: Navy Blue (#1e3a8a)
- **Secondary**: Bright Blue (#3b82f6)
- **Accent**: Sky Blue (#0ea5e9)

## Security Features

- Token-based authentication
- CORS configuration
- Password validation
- Role-based access control
- SQL injection prevention (Django ORM)

## Future Enhancements

- [ ] Multi-language support
- [ ] Peer review system
- [ ] Video streaming with playback controls
- [ ] CMS for admin content management
- [ ] Offline PWA support
- [ ] Advanced analytics with ML predictions
- [ ] Social learning features

## Contributing

Guidelines for contributing to Learnatics:

1. Follow PEP 8 for Python code
2. Use Prettier for JavaScript formatting
3. Write tests for new features
4. Update documentation

## License

© 2026 Learnatics. All rights reserved.
