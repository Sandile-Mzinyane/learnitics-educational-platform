import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnatics.settings')
django.setup()

from apps.users.models import User

users = [
    ('student', 'student@gmail.com', 'student', 'student123'),
    ('teacher', 'teacher@gmail.com', 'teacher', 'teacher123'),
    ('admin', 'admin@gmail.com', 'admin', 'admin123'),
]

for username, email, role, password in users:
    user, created = User.objects.get_or_create(username=username)
    user.email = email
    user.role = role
    user.set_password(password)
    user.save()
    print(f"Updated {username}: email={email}, role={role}, created={created}")
