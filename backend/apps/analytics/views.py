from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PerformanceMetric, PerformanceHeatmap, ClassAnalytics, StudentStrengthWeakness
from .serializers import (PerformanceMetricSerializer, PerformanceHeatmapSerializer,
                          ClassAnalyticsSerializer, StudentStrengthWeaknessSerializer)

class PerformanceMetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PerformanceMetric.objects.all()
    serializer_class = PerformanceMetricSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = []
    
    @action(detail=False, methods=['get'])
    def course_metrics(self, request):
        course_id = request.query_params.get('course_id')
        if course_id:
            metric = PerformanceMetric.objects.filter(course_id=course_id).first()
            if metric:
                serializer = self.get_serializer(metric)
                return Response(serializer.data)
        return Response({'error': 'Course not found'}, status=404)

class PerformanceHeatmapViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PerformanceHeatmap.objects.all()
    serializer_class = PerformanceHeatmapSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-difficulty_score']

class ClassAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClassAnalytics.objects.all()
    serializer_class = ClassAnalyticsSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = []

class StudentStrengthWeaknessViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentStrengthWeaknessSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = []
    
    def get_queryset(self):
        if self.request.user.role in ['teacher', 'admin']:
            return StudentStrengthWeakness.objects.all()
        return StudentStrengthWeakness.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        profile, created = StudentStrengthWeakness.objects.get_or_create(student=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
