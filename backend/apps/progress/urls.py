from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (StudentProgressViewSet, LessonCompletionViewSet,
                    BadgeViewSet, StudentBadgeViewSet)

router = DefaultRouter()
router.register(r'progress', StudentProgressViewSet, basename='progress')
router.register(r'lessons', LessonCompletionViewSet, basename='lesson-completion')
router.register(r'badges', BadgeViewSet, basename='badge')
router.register(r'student-badges', StudentBadgeViewSet, basename='student-badge')

urlpatterns = [
    path('', include(router.urls)),
]
