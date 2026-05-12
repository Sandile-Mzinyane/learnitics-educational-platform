# SETUP GUIDE - Learnatics Learning Platform

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 14 or higher
- Git

## Quick Setup

### Automated Setup (Recommended)

#### On Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

#### On Windows:
```bash
setup.bat
```

### Manual Setup

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and update:
```
SECRET_KEY=your-secure-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Database Setup

```bash
python manage.py migrate
python manage.py createsuperuser  # Create admin account
```

### 5. Create Sample Data (Optional)

```bash
python manage.py shell
```

Then create sample courses, modules, and lessons.

### 6. Start Backend Server

```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Verify `REACT_APP_API_URL`:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm start
```

Frontend will open at: http://localhost:3000

## Access the Application

### 1. Landing Page
- URL: http://localhost:3000
- View course offerings and platform features

### 2. Admin Dashboard
- URL: http://localhost:8000/admin
- Username: (created during setup)
- Password: (created during setup)

### 3. User Registration
- Click "Sign Up" on landing page
- Fill in the registration form
- Start learning!

## Docker Setup (Optional)

If you prefer to use Docker:

```bash
docker-compose up -d
```

This will start both frontend and backend services.

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
python manage.py runserver 8001
```

**Database errors:**
```bash
python manage.py migrate --run-syncdb
```

**Permission issues (Linux/Mac):**
```bash
chmod +x manage.py
```

### Frontend Issues

**Port 3000 already in use:**
```bash
npm start -- --port 3001
```

**Module not found errors:**
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Verify backend is running on http://localhost:8000
- Check `.env` file has correct API_URL
- Clear browser cache and restart

## Project Structure

```
Leanatics/
├── backend/
│   ├── learnatics/          # Main Django project
│   ├── apps/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── quizzes/
│   │   ├── progress/
│   │   └── analytics/
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## Available Scripts

### Backend

```bash
# Run server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code with Prettier
npm run format
```

## Default Admin Credentials

After creating the superuser:
- URL: http://localhost:8000/admin
- Username: (as specified during setup)
- Password: (as specified during setup)

## API Documentation

Swagger/OpenAPI documentation available at:
```
http://localhost:8000/api/docs/
```

## Database

The application uses SQLite by default for development. For production, consider using PostgreSQL:

1. Install PostgreSQL
2. Create a database: `createdb learnatics`
3. Update `.env`:
```
DATABASE_URL=postgresql://user:password@localhost/learnatics
```
4. Install psycopg2: `pip install psycopg2`
5. Run migrations

## Next Steps

1. **Create Courses**: Use admin panel to add courses
2. **Add Modules**: Create modules for each course
3. **Add Lessons**: Create lessons within modules
4. **Create Quizzes**: Add assessments for each module
5. **Enroll Students**: Have users sign up and enroll in courses
6. **Monitor Analytics**: Track student progress and performance

## Support & Documentation

- Full Documentation: See [README.md](../README.md)
- API Docs: http://localhost:8000/api/docs/
- Issues: Create an issue in the repository

## Performance Tips

- Use pagination for large course lists
- Enable caching for static content
- Optimize images before uploading
- Use CDN for media files in production
- Monitor database queries

## Security Notes

- Change `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Use HTTPS in production
- Keep dependencies updated
- Use strong passwords for admin account
- Configure CORS properly for production

---

**Happy Learning with Learnatics! 🚀**
