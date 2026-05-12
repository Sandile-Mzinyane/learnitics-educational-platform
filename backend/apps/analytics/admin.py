from django.contrib import admin
from .models import PerformanceMetric, PerformanceHeatmap, ClassAnalytics, StudentStrengthWeakness

@admin.register(PerformanceMetric)
class PerformanceMetricAdmin(admin.ModelAdmin):
    list_display = ['course', 'total_students', 'average_quiz_score', 'updated_at']
    search_fields = ['course__title']

@admin.register(PerformanceHeatmap)
class PerformanceHeatmapAdmin(admin.ModelAdmin):
    list_display = ['question', 'total_attempts', 'difficulty_score']
    search_fields = ['question__question_text']

@admin.register(ClassAnalytics)
class ClassAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['course', 'total_students', 'average_score', 'pass_rate']
    search_fields = ['course__title']

@admin.register(StudentStrengthWeakness)
class StudentStrengthWeaknessAdmin(admin.ModelAdmin):
    list_display = ['student', 'strongest_topic', 'weakest_topic', 'engagement_level']
    list_filter = ['learning_speed', 'engagement_level']
    search_fields = ['student__username']
