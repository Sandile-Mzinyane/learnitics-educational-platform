from django.db import models
from apps.users.models import User
from apps.courses.models import Course, Module, Lesson

class StudentProgress(models.Model):
    """
    Tracks student progress through modules and courses
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, null=True, blank=True)
    percentage_completed = models.FloatField(default=0)
    lessons_completed = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    quiz_score = models.FloatField(null=True, blank=True)
    is_module_unlocked = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_progress'
        unique_together = ('student', 'course', 'module')
        verbose_name_plural = 'Student Progress'
    
    def __str__(self):
        return f"{self.student.username} - {self.course.title}"


class LessonCompletion(models.Model):
    """
    Tracks individual lesson completion
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_completions')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    time_spent_seconds = models.IntegerField(default=0)
    completion_percentage = models.FloatField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'lesson_completions'
        unique_together = ('student', 'lesson')
    
    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"


class Badge(models.Model):
    """
    Achievement badges for students
    """
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/', blank=True, null=True)
    criteria = models.TextField()
    points_reward = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'badges'
    
    def __str__(self):
        return self.name


class StudentBadge(models.Model):
    """
    Tracks badges earned by students
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'student_badges'
        unique_together = ('student', 'badge')
    
    def __str__(self):
        return f"{self.student.username} - {self.badge.name}"
