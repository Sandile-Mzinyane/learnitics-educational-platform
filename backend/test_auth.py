#!/usr/bin/env python
import os
import django
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnatics.settings')

# Setup Django
django.setup()

from django.contrib.auth import authenticate
from apps.users.models import User

print("Testing authentication...")

# Test authentication
user = authenticate(username='admin', password='admin123')
if user:
    print('✓ Authentication successful for admin')
    print(f'  User: {user.username}, Role: {user.role}')
else:
    print('✗ Authentication failed')

# Check if user exists
try:
    u = User.objects.get(username='admin')
    print(f'✓ User exists: {u.username}')
    print(f'  Password check: {u.check_password("admin123")}')
    print(f'  Is active: {u.is_active}')
except User.DoesNotExist:
    print('✗ User does not exist')

# Test other users
for username in ['teacher', 'student']:
    user = authenticate(username=username, password=f'{username}123')
    if user:
        print(f'✓ Authentication successful for {username}')
    else:
        print(f'✗ Authentication failed for {username}')