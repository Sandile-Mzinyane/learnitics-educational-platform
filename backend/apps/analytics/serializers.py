from rest_framework import serializers
from .models import PerformanceMetric, PerformanceHeatmap, ClassAnalytics, StudentStrengthWeakness

class PerformanceMetricSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = PerformanceMetric
        fields = ['id', 'course', 'course_title', 'total_students', 'average_quiz_score',
                  'average_completion_rate', 'students_passed', 'students_failed', 'updated_at']

class PerformanceHeatmapSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    
    class Meta:
        model = PerformanceHeatmap
        fields = ['id', 'question', 'question_text', 'total_attempts', 'correct_attempts',
                  'incorrect_attempts', 'difficulty_score', 'updated_at']

class ClassAnalyticsSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = ClassAnalytics
        fields = ['id', 'course', 'course_title', 'total_students', 'average_score',
                  'median_score', 'pass_rate', 'engagement_score', 'most_challenging_topic',
                  'least_challenging_topic', 'updated_at']

class StudentStrengthWeaknessSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    
    class Meta:
        model = StudentStrengthWeakness
        fields = ['id', 'student', 'student_name', 'strongest_topic', 'weakest_topic',
                  'average_quiz_score', 'learning_speed', 'engagement_level',
                  'recommended_resources', 'updated_at']
