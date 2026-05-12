from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StudentProgress, LessonCompletion, Badge, StudentBadge
from .serializers import (StudentProgressSerializer, LessonCompletionSerializer,
                          BadgeSerializer, StudentBadgeSerializer)

class StudentProgressViewSet(viewsets.ModelViewSet):
    serializer_class = StudentProgressSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-last_accessed']
    
    def get_queryset(self):
        if self.request.user.role in ['teacher', 'admin']:
            return StudentProgress.objects.all()
        return StudentProgress.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        progress = StudentProgress.objects.filter(student=request.user)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)

class LessonCompletionViewSet(viewsets.ModelViewSet):
    serializer_class = LessonCompletionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = []
    
    def get_queryset(self):
        if self.request.user.role in ['teacher', 'admin']:
            return LessonCompletion.objects.all()
        return LessonCompletion.objects.filter(student=self.request.user)

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]

class StudentBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentBadgeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['teacher', 'admin']:
            return StudentBadge.objects.all()
        return StudentBadge.objects.filter(student=self.request.user)
