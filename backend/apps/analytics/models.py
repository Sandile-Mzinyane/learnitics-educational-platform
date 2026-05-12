from django.db import models
from django.db.models import Avg, Count
from apps.users.models import User
from apps.courses.models import Course, Module
from apps.quizzes.models import Quiz, Question

class PerformanceMetric(models.Model):
    """
    Real-time performance analytics for courses and modules
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='performance_metrics')
    total_students = models.IntegerField(default=0)
    average_quiz_score = models.FloatField(default=0)
    average_completion_rate = models.FloatField(default=0)
    students_passed = models.IntegerField(default=0)
    students_failed = models.IntegerField(default=0)
    most_common_mistakes = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'performance_metrics'
        unique_together = ('course',)
    
    def __str__(self):
        return f"Metrics for {self.course.title}"


class PerformanceHeatmap(models.Model):
    """
    Heatmap data showing topic difficulty across student population
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='heatmap_data')
    total_attempts = models.IntegerField(default=0)
    correct_attempts = models.IntegerField(default=0)
    incorrect_attempts = models.IntegerField(default=0)
    difficulty_score = models.FloatField(default=0)  # 0-100, higher = harder
    common_mistakes = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'performance_heatmaps'
        unique_together = ('question',)
    
    def __str__(self):
        return f"Heatmap for Q{self.question.order}: {self.difficulty_score}%"
    
    def calculate_difficulty(self):
        if self.total_attempts > 0:
            success_rate = (self.correct_attempts / self.total_attempts) * 100
            self.difficulty_score = 100 - success_rate
            self.save()


class ClassAnalytics(models.Model):
    """
    Aggregated analytics for a class/cohort
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='class_analytics')
    total_students = models.IntegerField(default=0)
    average_score = models.FloatField(default=0)
    median_score = models.FloatField(default=0)
    pass_rate = models.FloatField(default=0)
    engagement_score = models.FloatField(default=0)
    most_challenging_topic = models.CharField(max_length=255, blank=True)
    least_challenging_topic = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'class_analytics'
        unique_together = ('course',)
        verbose_name_plural = 'Class Analytics'
    
    def __str__(self):
        return f"Class Analytics - {self.course.title}"


class StudentStrengthWeakness(models.Model):
    """
    Tracks individual student strengths and weaknesses
    """
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='strengths_weaknesses')
    strongest_topic = models.CharField(max_length=255, blank=True, null=True)
    weakest_topic = models.CharField(max_length=255, blank=True, null=True)
    average_quiz_score = models.FloatField(default=0)
    learning_speed = models.CharField(max_length=20, choices=[
        ('slow', 'Slow'),
        ('average', 'Average'),
        ('fast', 'Fast'),
    ], default='average')
    engagement_level = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ], default='medium')
    recommended_resources = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_strength_weakness'
    
    def __str__(self):
        return f"S&W Profile - {self.student.username}"
