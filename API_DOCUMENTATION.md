# API DOCUMENTATION - Learnatics Learning Platform

## Base URL
```
http://localhost:8000/api
```

## Authentication

All API requests (except login/register) require a token in the Authorization header:
```
Authorization: Token YOUR_AUTH_TOKEN
```

## Endpoints

### Authentication

#### Register
```http
POST /users/register/
```

**Request Body:**
```json
{
  "username": "student1",
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "SecurePassword123",
  "password2": "SecurePassword123",
  "role": "student"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student@example.com",
    "role": "student"
  },
  "token": "abc123def456..."
}
```

#### Login
```http
POST /users/login/
```

**Request Body:**
```json
{
  "username": "student1",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student@example.com",
    "role": "student"
  },
  "token": "abc123def456..."
}
```

#### Get Current User
```http
GET /users/me/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "student1",
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"
}
```

#### Logout
```http
POST /users/logout/
```

**Response:** `200 OK`
```json
{
  "message": "Successfully logged out"
}
```

---

### Courses

#### List All Courses
```http
GET /courses/courses/
```

**Query Parameters:**
- `course_type`: Filter by type (HCI, SE, PM, DV)
- `difficulty_level`: Filter by level (beginner, intermediate, advanced)
- `is_free`: Filter by free/paid (true, false)
- `search`: Search by title or description
- `page`: Pagination (default: 1)

**Response:** `200 OK`
```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Human Computer Interaction",
      "slug": "human-computer-interaction",
      "description": "Master user-centered design principles...",
      "course_type": "HCI",
      "instructor": 2,
      "instructor_name": "Dr. Jane Smith",
      "difficulty_level": "beginner",
      "duration_weeks": 6,
      "total_modules": 5,
      "is_free": true,
      "price": "0.00",
      "is_published": true,
      "enable_offline": true,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

#### Get Course Details
```http
GET /courses/courses/{id}/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Human Computer Interaction",
  "description": "...",
  "modules": [
    {
      "id": 1,
      "title": "Introduction to HCI",
      "order": 1,
      "lessons": [
        {
          "id": 1,
          "title": "What is HCI?",
          "order": 1,
          "lesson_type": "video"
        }
      ]
    }
  ],
  "curriculum_mapping": {
    "sdg_objectives": "...",
    "learning_outcomes": "..."
  }
}
```

#### Enroll in Course
```http
POST /courses/courses/{id}/enroll/
```

**Response:** `200 OK`
```json
{
  "message": "Successfully enrolled in course"
}
```

#### Get My Courses
```http
GET /courses/courses/my_courses/
```

**Response:** `200 OK`
```json
{
  "count": 2,
  "results": [...]
}
```

---

### Quizzes

#### Start Quiz Attempt
```http
POST /quizzes/quizzes/{quiz_id}/start_attempt/
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "quiz": 1,
  "attempt_number": 1,
  "status": "in_progress",
  "started_at": "2026-01-20T14:30:00Z",
  "score": null,
  "percentage": null,
  "passed": false
}
```

#### Submit Answer
```http
POST /quizzes/attempts/{attempt_id}/submit_answer/
```

**Request Body:**
```json
{
  "question_id": 5,
  "answer": "user's answer text"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "question": 5,
  "student_answer": "user's answer text",
  "is_correct": true,
  "points_earned": 1.0
}
```

#### Submit Quiz
```http
POST /quizzes/attempts/{attempt_id}/submit_quiz/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "quiz": 1,
  "attempt_number": 1,
  "score": 8.0,
  "percentage": 80.0,
  "status": "graded",
  "passed": true,
  "submitted_at": "2026-01-20T14:45:00Z",
  "time_spent_seconds": 900
}
```

#### Get My Quiz Attempts
```http
GET /quizzes/quizzes/{quiz_id}/my_attempts/
```

**Response:** `200 OK`
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "quiz": 1,
      "attempt_number": 1,
      "score": 8.0,
      "percentage": 80.0,
      "passed": true
    }
  ]
}
```

---

### Progress

#### Get My Progress
```http
GET /progress/progress/my_progress/
```

**Response:** `200 OK`
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "course": 1,
      "course_title": "Human Computer Interaction",
      "percentage_completed": 75.0,
      "lessons_completed": 15,
      "total_lessons": 20,
      "quiz_score": 85.5,
      "is_module_unlocked": true,
      "started_at": "2026-01-15T10:00:00Z",
      "completed_at": null
    }
  ]
}
```

---

### Analytics

#### Get Course Metrics
```http
GET /analytics/metrics/?course_id={course_id}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "course": 1,
  "course_title": "Human Computer Interaction",
  "total_students": 150,
  "average_quiz_score": 78.5,
  "average_completion_rate": 65.0,
  "students_passed": 120,
  "students_failed": 30,
  "updated_at": "2026-01-20T15:00:00Z"
}
```

#### Get Performance Heatmaps
```http
GET /analytics/heatmaps/?course={course_id}
```

**Response:** `200 OK`
```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "question": 5,
      "question_text": "What is user-centered design?",
      "total_attempts": 150,
      "correct_attempts": 120,
      "incorrect_attempts": 30,
      "difficulty_score": 20.0,
      "updated_at": "2026-01-20T15:00:00Z"
    }
  ]
}
```

#### Get Student Strength/Weakness Profile
```http
GET /analytics/strength-weakness/my_profile/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "student": 5,
  "student_name": "John Doe",
  "strongest_topic": "User Research",
  "weakest_topic": "Prototyping",
  "average_quiz_score": 82.0,
  "learning_speed": "average",
  "engagement_level": "high",
  "recommended_resources": "Focus on prototyping techniques..."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "details": {
    "field": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Pagination

All list endpoints support pagination:

```http
GET /courses/courses/?page=2&page_size=20
```

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/courses/courses/?page=3&page_size=20",
  "previous": "http://localhost:8000/api/courses/courses/?page=1&page_size=20",
  "results": [...]
}
```

---

## Rate Limiting

- Standard: 100 requests per hour per user
- Authenticated: 1000 requests per hour per user

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "password": "password123"}'

# Get courses (with token)
curl -X GET http://localhost:8000/api/courses/courses/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Using Python Requests

```python
import requests

# Login
response = requests.post(
  'http://localhost:8000/api/users/login/',
  json={'username': 'student1', 'password': 'password123'}
)
token = response.json()['token']

# Get courses
headers = {'Authorization': f'Token {token}'}
courses = requests.get(
  'http://localhost:8000/api/courses/courses/',
  headers=headers
).json()
```

---

## Interactive API Documentation

Swagger UI: http://localhost:8000/api/docs/
ReDoc: http://localhost:8000/api/schema/

---

## Support

For API issues or questions, create an issue on GitHub or contact: support@learnatics.app
