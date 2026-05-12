from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Course, Module, Lesson, CurriculumMapping
from .serializers import (CourseSerializer, CourseDetailSerializer, 
                          ModuleSerializer, LessonSerializer, CurriculumMappingSerializer)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title', 'duration_weeks']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'admin':
            return Course.objects.all()
        elif hasattr(user, 'role') and user.role == 'teacher':
            return Course.objects.filter(instructor=user)
        return Course.objects.filter(is_published=True)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user
        if user not in course.students_enrolled.all():
            course.students_enrolled.add(user)
            return Response({'message': 'Successfully enrolled in course'})
        return Response({'message': 'Already enrolled in this course'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        courses = request.user.enrolled_courses.all()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_taught_courses(self, request):
        """Get courses taught by the current teacher"""
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can view taught courses'}, status=403)
        courses = Course.objects.filter(instructor=request.user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering = ['order']

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]
    filter_backends = []

class CurriculumMappingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CurriculumMapping.objects.all()
    serializer_class = CurriculumMappingSerializer
    permission_classes = [AllowAny]
