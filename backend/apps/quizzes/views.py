from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Quiz, Question, QuizAttempt, StudentAnswer
from .serializers import (QuizSerializer, QuestionSerializer, QuestionDetailSerializer,
                          QuizAttemptSerializer, StudentAnswerSerializer)

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering = ['created_at']
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def start_attempt(self, request, pk=None):
        quiz = self.get_object()
        user = request.user
        attempt_number = QuizAttempt.objects.filter(quiz=quiz, student=user).count() + 1
        
        if attempt_number > quiz.max_attempts:
            return Response({'error': 'Maximum attempts exceeded'}, status=status.HTTP_400_BAD_REQUEST)
        
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=user,
            attempt_number=attempt_number,
            total_points=sum([q.points for q in quiz.questions.all()])
        )
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def my_attempts(self, request, pk=None):
        quiz = self.get_object()
        attempts = QuizAttempt.objects.filter(quiz=quiz, student=request.user)
        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)

class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering = ['order']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuestionDetailSerializer
        return QuestionSerializer

class QuizAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role in ['teacher', 'admin']:
            return QuizAttempt.objects.all()
        return QuizAttempt.objects.filter(student=self.request.user)
    
    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        attempt = self.get_object()
        question_id = request.data.get('question_id')
        answer = request.data.get('answer')
        
        try:
            question = attempt.quiz.questions.get(id=question_id)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        
        is_correct = (answer.strip().lower() == question.correct_answer.strip().lower())
        points = question.points if is_correct else 0
        
        student_answer, created = StudentAnswer.objects.update_or_create(
            quiz_attempt=attempt,
            question=question,
            defaults={'student_answer': answer, 'is_correct': is_correct, 'points_earned': points}
        )
        
        serializer = StudentAnswerSerializer(student_answer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def submit_quiz(self, request, pk=None):
        attempt = self.get_object()
        attempt.status = 'submitted'
        attempt.submitted_at = timezone.now()
        attempt.time_spent_seconds = int((attempt.submitted_at - attempt.started_at).total_seconds())
        
        total_score = sum([answer.points_earned or 0 for answer in attempt.answers.all()])
        attempt.score = total_score
        attempt.percentage = (total_score / attempt.total_points * 100) if attempt.total_points > 0 else 0
        attempt.passed = attempt.percentage >= attempt.quiz.passing_score
        attempt.status = 'graded'
        attempt.save()
        
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)
