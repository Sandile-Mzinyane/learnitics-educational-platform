from django.utils.text import slugify
from rest_framework import serializers
from .models import Course, Module, Lesson, CurriculumMapping
from apps.quizzes.serializers import QuizSerializer

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'content', 'lesson_type', 
                  'video_url', 'video_duration', 'order', 'duration_minutes', 
                  'is_downloadable', 'thumbnail']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'is_locked', 
                  'unlock_score', 'lessons', 'quiz', 'created_at']

class CurriculumMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumMapping
        fields = ['id', 'sdg_objectives', 'learning_outcomes', 'standards_aligned']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.SerializerMethodField()
    students_enrolled_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    
    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name() or obj.instructor.username
        return None
    
    def get_students_enrolled_count(self, obj):
        return obj.students_enrolled.count()

    def get_is_enrolled(self, obj):
        user = self.context.get('request') and getattr(self.context.get('request'), 'user', None)
        if user and user.is_authenticated:
            return obj.students_enrolled.filter(pk=user.pk).exists()
        return False

    def create(self, validated_data):
        if not validated_data.get('slug'):
            base_slug = slugify(validated_data.get('title', 'course'))
            slug = base_slug
            count = 1
            while Course.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{count}"
                count += 1
            validated_data['slug'] = slug
        return super().create(validated_data)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'course_type', 'instructor',
                  'instructor_name', 'thumbnail', 'difficulty_level', 'duration_weeks',
                  'total_modules', 'is_free', 'price', 'is_published', 'modules',
                  'enable_offline', 'students_enrolled_count', 'is_enrolled', 'created_at', 'updated_at']

class CourseDetailSerializer(CourseSerializer):
    curriculum_mapping = CurriculumMappingSerializer(read_only=True)
    
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['curriculum_mapping']
