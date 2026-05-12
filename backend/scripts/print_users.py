import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnatics.settings')
django.setup()

from apps.users.models import User

for username in ['student','teacher','admin']:
    try:
        user = User.objects.get(username=username)
        print(f'{user.username}: email={user.email}, role={user.role}, password_set={user.has_usable_password()}')
    except User.DoesNotExist:
        print(f'{username} does not exist')
