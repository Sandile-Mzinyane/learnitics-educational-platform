"""
URL configuration for learnatics project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.users.views import UserViewSet, UserProfileViewSet
from apps.courses.views import CourseViewSet, ModuleViewSet, LessonViewSet, CurriculumMappingViewSet
from apps.quizzes.views import QuizViewSet, QuestionViewSet, QuizAttemptViewSet
from apps.progress.views import StudentProgressViewSet, LessonCompletionViewSet, BadgeViewSet, StudentBadgeViewSet
from apps.analytics.views import PerformanceMetricViewSet, PerformanceHeatmapViewSet, ClassAnalyticsViewSet, StudentStrengthWeaknessViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'users/profiles', UserProfileViewSet, basename='user-profile')
router.register(r'courses/courses', CourseViewSet, basename='course')
router.register(r'courses/modules', ModuleViewSet, basename='module')
router.register(r'courses/lessons', LessonViewSet, basename='lesson')
router.register(r'courses/curriculum', CurriculumMappingViewSet, basename='curriculum')
router.register(r'quizzes/quizzes', QuizViewSet, basename='quiz')
router.register(r'quizzes/questions', QuestionViewSet, basename='question')
router.register(r'quizzes/attempts', QuizAttemptViewSet, basename='quiz-attempt')
router.register(r'progress/progress', StudentProgressViewSet, basename='progress')
router.register(r'progress/lessons', LessonCompletionViewSet, basename='lesson-completion')
router.register(r'progress/badges', BadgeViewSet, basename='badge')
router.register(r'progress/student-badges', StudentBadgeViewSet, basename='student-badge')
router.register(r'analytics/metrics', PerformanceMetricViewSet, basename='performance-metric')
router.register(r'analytics/heatmaps', PerformanceHeatmapViewSet, basename='performance-heatmap')
router.register(r'analytics/class-analytics', ClassAnalyticsViewSet, basename='class-analytics')
router.register(r'analytics/strength-weakness', StudentStrengthWeaknessViewSet, basename='strength-weakness')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
