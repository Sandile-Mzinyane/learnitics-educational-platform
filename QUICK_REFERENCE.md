# Quick Reference Guide

## 🚀 Quick Start Commands

### Backend Setup & Run
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup & Run
```bash
# Navigate to frontend
cd frontend

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Install dependencies
npm install

# Start development server
npm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **API Docs**: http://localhost:8000/api/docs

## 📚 Default Test User (Create after setup)

Admin Panel → Auth and authorization → Users → Add User

## 📁 Important Files

### Backend Configuration
- `backend/learnatics/settings.py` - Django settings
- `backend/.env` - Environment variables
- `backend/requirements.txt` - Python dependencies

### Frontend Configuration
- `frontend/.env` - Environment variables
- `frontend/package.json` - npm dependencies
- `frontend/tailwind.config.js` - Tailwind configuration

## 🛠️ Common Commands

### Django Management
```bash
python manage.py makemigrations      # Create migrations
python manage.py migrate             # Apply migrations
python manage.py createsuperuser     # Create admin
python manage.py shell               # Python shell
python manage.py collectstatic       # Collect static files
python manage.py runserver 8001      # Change port
```

### NPM Commands
```bash
npm install [package]    # Install package
npm run build           # Build for production
npm test               # Run tests
npm start              # Development server
```

## 🔑 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
```

## 📊 Database Queries

### Access Database Shell
```bash
python manage.py dbshell
```

### Common Django Queries
```python
# In Django shell (python manage.py shell)
from apps.users.models import User
from apps.courses.models import Course

# Get all users
users = User.objects.all()

# Get specific user
user = User.objects.get(username='student1')

# Create new user
user = User.objects.create_user(
    username='test',
    email='test@example.com',
    password='pass123'
)

# Get all courses
courses = Course.objects.all()

# Filter courses
hci_courses = Course.objects.filter(course_type='HCI')
```

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123","password2":"pass123"}'

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'

# Get courses
curl http://localhost:8000/api/courses/courses/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Using Python Requests
```python
import requests

# Login
r = requests.post('http://localhost:8000/api/users/login/', 
    json={'username':'test', 'password':'pass123'})
token = r.json()['token']

# Get courses
headers = {'Authorization': f'Token {token}'}
courses = requests.get('http://localhost:8000/api/courses/courses/', 
    headers=headers).json()
```

## 🐛 Debugging Tips

### Backend Debugging
```python
# Add to views.py
print("Debug:", variable)

# Add breakpoint
import pdb; pdb.set_trace()

# Check logs
tail -f debug.log
```

### Frontend Debugging
```javascript
// Console log
console.log('Debug:', variable);

// React DevTools browser extension
// Network tab in browser DevTools
```

## 📁 Project Organization

### Add New Feature Step-by-Step

#### Backend:
1. Create model in `apps/[app]/models.py`
2. Create serializer in `apps/[app]/serializers.py`
3. Create viewset in `apps/[app]/views.py`
4. Add URL route in `apps/[app]/urls.py`
5. Register in admin if needed
6. Run migrations

#### Frontend:
1. Create component in `src/components/` or page in `src/pages/`
2. Add API call in `src/services/api.js`
3. Add state in `src/store/` if needed
4. Add route in `src/App.js`
5. Style with Tailwind CSS

## 💾 Database Backup

```bash
# Export database
python manage.py dumpdata > backup.json

# Import database
python manage.py loaddata backup.json
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID [PID] /F

# Linux/Mac
lsof -i :8000
kill -9 [PID]
```

### Missing Dependencies
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
npm install
npm audit fix
```

### Database Issues
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Build Issues
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Additional Resources

- Documentation: See [README.md](README.md)
- API Docs: http://localhost:8000/api/docs/
- Setup Guide: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Development: See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- API Reference: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

**Need help? Check the documentation files or review the code comments.**
