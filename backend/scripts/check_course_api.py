import os
import sys
import django
from django.test import Client

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnatics.settings')
django.setup()

client = Client()
response = client.get('/api/courses/courses/')
print('status', response.status_code)
print(response.content.decode('utf-8'))
