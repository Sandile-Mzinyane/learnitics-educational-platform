from django.contrib import admin
from .models import Quiz, Question, QuestionOption, QuizAttempt, StudentAnswer

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'passing_score', 'created_at']
    search_fields = ['title']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'quiz', 'question_type', 'order']
    list_filter = ['question_type', 'difficulty']
    search_fields = ['question_text']

@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
    list_display = ['option_text', 'question', 'is_correct', 'order']
    list_filter = ['is_correct']

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['student', 'quiz', 'attempt_number', 'score', 'percentage', 'passed']
    list_filter = ['passed', 'status', 'started_at']
    search_fields = ['student__username', 'quiz__title']

@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ['quiz_attempt', 'question', 'is_correct', 'points_earned']
    list_filter = ['is_correct']
