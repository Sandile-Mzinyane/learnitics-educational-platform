from django.db import models
from apps.users.models import User
from apps.courses.models import Module, Lesson

class Quiz(models.Model):
    """
    Represents a quiz for assessing student understanding
    """
    module = models.OneToOneField(Module, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=255)
    description = models.TextField()
    passing_score = models.IntegerField(default=80)
    time_limit_minutes = models.IntegerField(null=True, blank=True)
    max_attempts = models.IntegerField(default=3)
    is_timed = models.BooleanField(default=False)
    show_correct_answers = models.BooleanField(default=True)
    allow_review = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'quizzes'
        verbose_name_plural = 'Quizzes'
    
    def __str__(self):
        return self.title


class Question(models.Model):
    """
    Represents individual questions in a quiz
    """
    QUESTION_TYPES = (
        ('multiple_choice', 'Multiple Choice'),
        ('fill_blank', 'Fill in the Blank'),
        ('true_false', 'True/False'),
        ('essay', 'Essay'),
    )
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES)
    image = models.ImageField(upload_to='question_images/', blank=True, null=True)
    correct_answer = models.TextField()
    explanation = models.TextField(blank=True, null=True)
    order = models.IntegerField()
    points = models.IntegerField(default=1)
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'questions'
        ordering = ['order']
        unique_together = ('quiz', 'order')
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}"


class QuestionOption(models.Model):
    """
    Options for multiple choice questions
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField()
    
    class Meta:
        db_table = 'question_options'
        ordering = ['order']
        unique_together = ('question', 'order')
    
    def __str__(self):
        return f"{self.question.quiz.title} - Option {self.order}"


class QuizAttempt(models.Model):
    """
    Records each student's quiz attempt
    """
    ATTEMPT_STATUS = (
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
    )
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    attempt_number = models.IntegerField()
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    total_points = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    percentage = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=ATTEMPT_STATUS, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    time_spent_seconds = models.IntegerField(default=0)
    passed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'quiz_attempts'
        ordering = ['-started_at']
        unique_together = ('quiz', 'student', 'attempt_number')
    
    def __str__(self):
        return f"{self.student.username} - {self.quiz.title} (Attempt {self.attempt_number})"


class StudentAnswer(models.Model):
    """
    Records student's individual question answers
    """
    quiz_attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    student_answer = models.TextField()
    is_correct = models.BooleanField(null=True, blank=True)
    points_earned = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    answered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'student_answers'
        unique_together = ('quiz_attempt', 'question')
    
    def __str__(self):
        return f"{self.quiz_attempt} - Q{self.question.order}"
