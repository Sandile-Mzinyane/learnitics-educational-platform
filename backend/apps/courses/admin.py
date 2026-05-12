from django.contrib import admin
from .models import Course, Module, Lesson, CurriculumMapping

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_type', 'instructor', 'is_published', 'created_at']
    list_filter = ['course_type', 'difficulty_level', 'is_published']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'is_locked']
    list_filter = ['is_locked', 'course']
    search_fields = ['title']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'lesson_type', 'order']
    list_filter = ['lesson_type']
    search_fields = ['title']

@admin.register(CurriculumMapping)
class CurriculumMappingAdmin(admin.ModelAdmin):
    list_display = ['course', 'created_at']
    search_fields = ['course__title']
