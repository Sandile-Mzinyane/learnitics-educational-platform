from django.contrib import admin
from .models import StudentProgress, LessonCompletion, Badge, StudentBadge

@admin.register(StudentProgress)
class StudentProgressAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'percentage_completed', 'quiz_score', 'is_module_unlocked']
    list_filter = ['is_module_unlocked', 'course']
    search_fields = ['student__username']

@admin.register(LessonCompletion)
class LessonCompletionAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'is_completed', 'time_spent_seconds']
    list_filter = ['is_completed']
    search_fields = ['student__username', 'lesson__title']

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'points_reward', 'created_at']
    search_fields = ['name']

@admin.register(StudentBadge)
class StudentBadgeAdmin(admin.ModelAdmin):
    list_display = ['student', 'badge', 'earned_at']
    list_filter = ['badge', 'earned_at']
    search_fields = ['student__username']
