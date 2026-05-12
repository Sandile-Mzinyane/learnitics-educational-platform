# Learnatics Development Guide

## Code Structure

### Backend (Django)

```
backend/
├── learnatics/                 # Main project directory
│   ├── __init__.py
│   ├── settings.py          # Configuration
│   ├── urls.py              # URL routing
│   ├── wsgi.py              # Production entry point
│   └── asgi.py              # Async entry point
│
├── apps/                    # Django applications
│   ├── users/               # User management
│   │   ├── models.py        # User, UserProfile
│   │   ├── views.py         # Authentication endpoints
│   │   ├── serializers.py   # Data validation & serialization
│   │   ├── urls.py          # App-specific routing
│   │   └── admin.py         # Admin panel
│   │
│   ├── courses/             # Course content
│   │   ├── models.py        # Course, Module, Lesson
│   │   ├── views.py         # Course endpoints
│   │   └── serializers.py
│   │
│   ├── quizzes/             # Quiz & assessments
│   │   ├── models.py        # Quiz, Question, QuizAttempt
│   │   ├── views.py         # Quiz endpoints
│   │   └── serializers.py
│   │
│   ├── progress/            # Student progress
│   │   ├── models.py        # StudentProgress, Badge
│   │   └── views.py
│   │
│   └── analytics/           # Analytics & insights
│       ├── models.py        # Performance metrics
│       └── views.py
│
├── manage.py                # Django CLI
└── requirements.txt         # Python dependencies
```

### Frontend (React)

```
frontend/
├── src/
│   ├── pages/               # Full page components
│   │   ├── LandingPage.js   # Homepage
│   │   ├── LoginPage.js     # Login form
│   │   ├── SignupPage.js    # Registration
│   │   └── DashboardPage.js # User dashboard
│   │
│   ├── components/          # Reusable components
│   │   ├── Sidebar.js
│   │   ├── ProgressBar.js
│   │   ├── BadgeCard.js
│   │   └── AnalyticsCard.js
│   │
│   ├── services/            # API calls
│   │   └── api.js           # Axios configuration
│   │
│   ├── store/               # State management
│   │   └── authStore.js     # Zustand stores
│   │
│   ├── assets/              # Static files
│   ├── App.js               # Main component
│   ├── App.css              # Global styles
│   └── index.js             # Entry point
│
├── public/
│   └── index.html           # HTML template
├── package.json
└── tailwind.config.js       # Tailwind CSS config
```

## Development Workflow

### 1. Creating a New Feature

#### Backend (Django)

1. Create models in `apps/[app_name]/models.py`
2. Create serializers in `apps/[app_name]/serializers.py`
3. Create views in `apps/[app_name]/views.py`
4. Register endpoints in `apps/[app_name]/urls.py`
5. Run migrations: `python manage.py makemigrations && python manage.py migrate`

Example - Adding a new feature:
```python
# models.py
class Feature(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

# serializers.py
class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name', 'created_at']

# views.py
class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [IsAuthenticated]
```

#### Frontend (React)

1. Create page component in `src/pages/`
2. Create reusable components in `src/components/`
3. Add API calls in `src/services/api.js`
4. Add state management in `src/store/`
5. Add routing in `src/App.js`

Example - Creating a feature page:
```jsx
// src/pages/FeaturePage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

export default function FeaturePage() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      const response = await apiService.get('/features/');
      setFeatures(response.data);
    };
    fetchFeatures();
  }, []);

  return (
    <div>
      {features.map(feature => (
        <motion.div key={feature.id}>
          {feature.name}
        </motion.div>
      ))}
    </div>
  );
}
```

### 2. Best Practices

#### Backend
- Follow PEP 8 style guide
- Use meaningful variable/function names
- Add docstrings to models and views
- Use transactions for critical operations
- Validate input data in serializers
- Use select_related/prefetch_related for queries
- Add proper error handling

#### Frontend
- Use functional components with hooks
- Keep components small and reusable
- Use Tailwind CSS for styling
- Add PropTypes validation
- Use meaningful component names
- Handle loading and error states
- Add keyboard navigation support

### 3. Testing

#### Backend
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.users

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

#### Frontend
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### 4. Code Quality

#### Backend
```bash
# Check code style
flake8 apps/

# Sort imports
isort apps/

# Format code
black apps/
```

#### Frontend
```bash
# ESLint
npm run lint

# Format with Prettier
npm run format
```

## Common Tasks

### Adding a New API Endpoint

1. **Backend:**
   ```python
   # views.py
   @action(detail=False, methods=['get'])
   def custom_endpoint(self, request):
       # Your logic here
       return Response({'data': 'value'})
   ```

2. **Frontend:**
   ```javascript
   // api.js
   export const featureService = {
     customEndpoint: () => apiClient.get('/features/custom_endpoint/'),
   };
   ```

### Adding a New Model

1. Create in `models.py`
2. Create serializer in `serializers.py`
3. Register in admin: `admin.site.register(Model)`
4. Run: `python manage.py makemigrations && python manage.py migrate`

### Styling a Component

1. Use Tailwind CSS classes
2. For complex styling, add CSS in component file
3. Use consistent spacing (4px base unit)
4. Follow color scheme: primary (#1e3a8a), secondary (#3b82f6)

### Debugging

#### Backend
```python
# Print debug info
print("Debug:", variable)

# Use Django shell
python manage.py shell

# Check database
python manage.py dbshell
```

#### Frontend
```javascript
// Console logging
console.log('Debug:', variable);

// Use React DevTools browser extension
// Check Network tab for API calls
```

## Performance Tips

### Backend
- Use database indexing for frequently searched fields
- Implement caching with Redis
- Use pagination for large datasets
- Use bulk operations for multiple inserts
- Monitor slow queries

### Frontend
- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize images
- Use virtual scrolling for long lists
- Minimize bundle size

## Deployment

### Backend (Production)
```bash
# Set DEBUG=False in .env
# Use PostgreSQL instead of SQLite
# Set up Gunicorn/uWSGI
# Configure Nginx as reverse proxy
# Enable HTTPS
# Set up monitoring and logging
```

### Frontend (Production)
```bash
# Build: npm run build
# Deploy dist folder to CDN or server
# Configure CORS headers
# Enable gzip compression
```

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.vercel.app/)
- [Framer Motion](https://www.framer.com/motion/)

## Getting Help

- Check existing issues
- Read error messages carefully
- Google the error
- Ask in development channel
- Create detailed bug reports
