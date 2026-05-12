from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (PerformanceMetricViewSet, PerformanceHeatmapViewSet,
                    ClassAnalyticsViewSet, StudentStrengthWeaknessViewSet)

router = DefaultRouter()
router.register(r'metrics', PerformanceMetricViewSet, basename='performance-metric')
router.register(r'heatmaps', PerformanceHeatmapViewSet, basename='performance-heatmap')
router.register(r'class-analytics', ClassAnalyticsViewSet, basename='class-analytics')
router.register(r'strength-weakness', StudentStrengthWeaknessViewSet, basename='strength-weakness')

urlpatterns = [
    path('', include(router.urls)),
]
