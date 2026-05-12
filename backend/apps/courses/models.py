from django.db import models
from apps.users.models import User

class Course(models.Model):
    """
    Represents a course in the system
    """
    COURSE_CHOICES = (
        ('HCI', 'Human Computer Interaction'),
        ('SE', 'Software Engineering'),
        ('PM', 'Project Management'),
        ('DV', 'Data Visualization'),
    )
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    course_type = models.CharField(max_length=50, choices=COURSE_CHOICES)
    instructor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='courses_taught')
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_free = models.BooleanField(default=True)
    difficulty_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='beginner')
    duration_weeks = models.IntegerField(default=4)
    total_modules = models.IntegerField(default=0)
    students_enrolled = models.ManyToManyField(User, related_name='enrolled_courses', blank=True)
    is_published = models.BooleanField(default=False)
    enable_offline = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-created_at']
        verbose_name_plural = 'Courses'
    
    def __str__(self):
        return self.title


class Module(models.Model):
    """
    Represents a module within a course
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.IntegerField()
    is_locked = models.BooleanField(default=True)
    unlock_score = models.IntegerField(default=80)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'modules'
        ordering = ['order']
        unique_together = ('course', 'order')
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    """
    Represents a lesson within a module
    """
    LESSON_TYPE_CHOICES = (
        ('video', 'Video'),
        ('text', 'Text'),
        ('interactive', 'Interactive'),
    )
    
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField()
    lesson_type = models.CharField(max_length=50, choices=LESSON_TYPE_CHOICES, default='text')
    video_url = models.URLField(blank=True, null=True)
    video_duration = models.IntegerField(blank=True, null=True, help_text="Duration in seconds")
    order = models.IntegerField()
    duration_minutes = models.IntegerField(default=15)
    is_downloadable = models.BooleanField(default=True)
    attachments = models.FileField(upload_to='lesson_attachments/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='lesson_thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lessons'
        ordering = ['order']
        unique_together = ('module', 'order')
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"


class CurriculumMapping(models.Model):
    """
    Maps courses to SDG 4 learning objectives
    """
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='curriculum_mapping')
    sdg_objectives = models.TextField()
    learning_outcomes = models.TextField()
    standards_aligned = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'curriculum_mappings'
    
    def __str__(self):
        return f"Curriculum Mapping - {self.course.title}"
