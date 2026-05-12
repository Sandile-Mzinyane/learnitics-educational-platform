from rest_framework import serializers
from .models import StudentProgress, LessonCompletion, Badge, StudentBadge

class StudentProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    
    class Meta:
        model = StudentProgress
        fields = ['id', 'course', 'course_title', 'module', 'module_title', 
                  'percentage_completed', 'lessons_completed', 'total_lessons',
                  'quiz_score', 'is_module_unlocked', 'started_at', 'completed_at']

class LessonCompletionSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = LessonCompletion
        fields = ['id', 'lesson', 'lesson_title', 'is_completed', 
                  'time_spent_seconds', 'completion_percentage', 'started_at', 'completed_at']

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'points_reward']

class StudentBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = StudentBadge
        fields = ['id', 'badge', 'earned_at']
