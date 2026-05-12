import requests

endpoints = [
    'http://localhost:8000/api/courses/courses/',
    'http://localhost:8000/api/quizzes/quizzes/',
    'http://localhost:8000/api/progress/progress/',
    'http://localhost:8000/api/analytics/metrics/',
]

print("Testing API endpoints:")
for endpoint in endpoints:
    try:
        r = requests.get(endpoint, timeout=5)
        name = endpoint.split('/')[-2]
        print(f'✓ {name}: {r.status_code}')
    except Exception as e:
        name = endpoint.split('/')[-2]
        print(f'✗ {name}: ERROR - {str(e)[:40]}')
