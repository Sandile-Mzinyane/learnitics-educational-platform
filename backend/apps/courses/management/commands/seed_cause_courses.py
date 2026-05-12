from django.core.management.base import BaseCommand
from apps.courses.models import Course, Module, Lesson, CurriculumMapping
from apps.quizzes.models import Quiz, Question, QuestionOption

COURSES = [
    {
        'title': 'Human Computer Interaction Fundamentals',
        'slug': 'human-computer-interaction',
        'description': 'Learn the core principles of user-centered design, accessibility, and interaction patterns that make interfaces intuitive and delightful.',
        'course_type': 'HCI',
        'difficulty_level': 'beginner',
        'duration_weeks': 4,
        'total_modules': 2,
        'is_free': True,
        'is_published': True,
        'curriculum': {
            'sdg_objectives': 'Understand human behavior, accessibility, and usability.',
            'learning_outcomes': 'Apply HCI principles to design user-friendly interfaces and evaluate usability through research techniques.',
            'standards_aligned': 'ISO 9241, WCAG 2.1',
        },
        'modules': [
            {
                'title': 'Design Principles for Usability',
                'description': 'Explore key design principles in HCI such as affordances, consistency, and feedback.',
                'order': 1,
                'lessons': [
                    {
                        'title': 'Introduction to HCI',
                        'description': 'Understand the basics of human computer interaction and why it matters.',
                        'content': 'Human Computer Interaction explores how people interact with computers and how to design systems that support those interactions effectively.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 15,
                    },
                    {
                        'title': 'Usability and Accessibility',
                        'description': 'Learn how to build interfaces that are easy to use and accessible for everyone.',
                        'content': 'Accessibility is designing digital products that everyone can use, including users with disabilities. Usability makes interfaces simple and efficient.',
                        'lesson_type': 'video',
                        'order': 2,
                        'duration_minutes': 20,
                    },
                ],
                'quiz': {
                    'title': 'HCI Design Principles Quiz',
                    'description': 'Test your understanding of usability and design principles.',
                    'passing_score': 70,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'Which design principle helps users understand what actions are possible?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'Affordance',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'easy',
                            'options': [
                                'Affordance',
                                'Consistency',
                                'Feedback',
                                'Simplicity',
                            ],
                        },
                        {
                            'question_text': 'What does accessibility ensure?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'People with disabilities can use the interface',
                            'order': 2,
                            'points': 1,
                            'difficulty': 'easy',
                            'options': [
                                'The interface is visually appealing',
                                'People with disabilities can use the interface',
                                'The system runs quickly',
                                'Only experts can use it',
                            ],
                        },
                    ],
                },
            },
            {
                'title': 'User Research and Prototyping',
                'description': 'Learn research methods that help you understand users and rapidly validate ideas.',
                'order': 2,
                'lessons': [
                    {
                        'title': 'Conducting User Interviews',
                        'description': 'Learn how to ask the right questions and gather usable feedback.',
                        'content': 'User interviews help designers discover real user needs and pain points through direct conversation.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 18,
                    },
                    {
                        'title': 'Creating Personas and Journeys',
                        'description': 'Turn user research into personas, journeys, and actionable insights.',
                        'content': 'Personas represent archetypal users, while journeys map their experience with the product from start to finish.',
                        'lesson_type': 'interactive',
                        'order': 2,
                        'duration_minutes': 22,
                    },
                ],
                'quiz': {
                    'title': 'User Research Quiz',
                    'description': 'Check your understanding of user research and prototyping methods.',
                    'passing_score': 70,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'What is the main goal of a user persona?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'Describe a representative user for design decisions',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'medium',
                            'options': [
                                'List all possible users',
                                'Describe a representative user for design decisions',
                                'Measure system performance',
                                'Create marketing copy',
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        'title': 'Software Engineering Essentials',
        'slug': 'software-engineering-essentials',
        'description': 'Master the essential practices of software development, from planning and architecture to collaboration and deployment.',
        'course_type': 'SE',
        'difficulty_level': 'beginner',
        'duration_weeks': 5,
        'total_modules': 2,
        'is_free': True,
        'is_published': True,
        'curriculum': {
            'sdg_objectives': 'Understand software lifecycle, collaboration, and quality engineering practices.',
            'learning_outcomes': 'Apply engineering best practices to build reliable and maintainable software.',
            'standards_aligned': 'IEEE 12207, Agile Manifesto',
        },
        'modules': [
            {
                'title': 'The Software Development Life Cycle',
                'description': 'Learn the stages of software engineering from requirements through maintenance.',
                'order': 1,
                'lessons': [
                    {
                        'title': 'SDLC Overview',
                        'description': 'Understand the phases of the software development lifecycle.',
                        'content': 'The SDLC includes planning, analysis, design, implementation, testing, deployment, and maintenance.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 18,
                    },
                    {
                        'title': 'Requirement Gathering',
                        'description': 'Learn how to capture requirements and define scope clearly.',
                        'content': 'Good requirements help teams build the right product and avoid scope creep.',
                        'lesson_type': 'video',
                        'order': 2,
                        'duration_minutes': 20,
                    },
                ],
                'quiz': {
                    'title': 'SDLC Basics Quiz',
                    'description': 'Test your knowledge of the software development lifecycle.',
                    'passing_score': 70,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'Which phase comes first in the SDLC?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'Planning',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'easy',
                            'options': [
                                'Testing',
                                'Design',
                                'Planning',
                                'Deployment',
                            ],
                        },
                    ],
                },
            },
            {
                'title': 'Version Control and Collaboration',
                'description': 'Learn how teams use version control and collaborative workflows to build software together.',
                'order': 2,
                'lessons': [
                    {
                        'title': 'Git Basics',
                        'description': 'Learn the core Git commands and how branches work.',
                        'content': 'Git helps teams track changes, manage branches, and collaborate without losing work.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 20,
                    },
                    {
                        'title': 'Code Reviews and Pull Requests',
                        'description': 'Learn how to review code and collaborate through pull requests.',
                        'content': 'Code reviews improve code quality and share knowledge across the team.',
                        'lesson_type': 'interactive',
                        'order': 2,
                        'duration_minutes': 22,
                    },
                ],
                'quiz': {
                    'title': 'Collaboration Practices Quiz',
                    'description': 'Check your understanding of teamwork in software engineering.',
                    'passing_score': 70,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'What is the main benefit of using branches in Git?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'Isolate work before merging changes',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'medium',
                            'options': [
                                'Make code run faster',
                                'Isolate work before merging changes',
                                'Reduce file sizes',
                                'Encrypt the repository',
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        'title': 'Project Management for Tech Teams',
        'slug': 'project-management-for-tech-teams',
        'description': 'Build project planning, communication, and risk management skills tailored to software and digital teams.',
        'course_type': 'PM',
        'difficulty_level': 'beginner',
        'duration_weeks': 4,
        'total_modules': 2,
        'is_free': True,
        'is_published': True,
        'curriculum': {
            'sdg_objectives': 'Learn effective planning, stakeholder management, and risk mitigation for technical projects.',
            'learning_outcomes': 'Manage project scope, schedule, and communication for successful delivery.',
            'standards_aligned': 'PMI PMBOK, Agile Planning',
        },
        'modules': [
            {
                'title': 'Project Planning and Goals',
                'description': 'Learn how to define goals, deliverables, and timelines for a project.',
                'order': 1,
                'lessons': [
                    {
                        'title': 'Defining Scope and Objectives',
                        'description': 'Learn how to set clear goals and success criteria for projects.',
                        'content': 'A successful project begins with clear objectives, requirements, and success metrics.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 15,
                    },
                    {
                        'title': 'Creating a Project Plan',
                        'description': 'Learn how to build a reliable project plan with milestones and dependencies.',
                        'content': 'Project plans help teams stay aligned on timelines, responsibilities, and priorities.',
                        'lesson_type': 'video',
                        'order': 2,
                        'duration_minutes': 18,
                    },
                ],
                'quiz': {
                    'title': 'Project Planning Quiz',
                    'description': 'Check your knowledge of project planning and goal setting.',
                    'passing_score': 70,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'What is the purpose of a project milestone?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'Mark a key progress point in the schedule',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'easy',
                            'options': [
                                'Add extra features',
                                'Mark a key progress point in the schedule',
                                'Avoid team meetings',
                                'Reduce project budget',
                            ],
                        },
                    ],
                },
            },
            {
                'title': 'Risk and Communication',
                'description': 'Learn how to identify risks and keep stakeholders informed throughout the project.',
                'order': 2,
                'lessons': [
                    {
                        'title': 'Risk Assessment Techniques',
                        'description': 'Learn how to identify, analyze, and prioritize project risks.',
                        'content': 'Risk assessments help teams prepare for potential issues before they derail progress.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 20,
                    },
                    {
                        'title': 'Stakeholder Communication',
                        'description': 'Learn how to keep stakeholders updated and aligned throughout execution.',
                        'content': 'Transparent communication keeps stakeholders informed and helps manage expectations.',
                        'lesson_type': 'interactive',
                        'order': 2,
                        'duration_minutes': 22,
                    },
                ],
                'quiz': {
                    'title': 'Risk and Communication Quiz',
                    'description': 'Test your understanding of project risk management and stakeholder communication.',
                    'passing_score': 70,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'Why is stakeholder communication important?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'It keeps expectations aligned and reduces surprises',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'medium',
                            'options': [
                                'It reduces project cost automatically',
                                'It keeps expectations aligned and reduces surprises',
                                'It guarantees faster delivery',
                                'It eliminates all risks',
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        'title': 'Advanced Software Engineering Practices',
        'slug': 'advanced-software-engineering',
        'description': 'Dive deep into advanced software engineering concepts including design patterns, architecture, and scalable systems.',
        'course_type': 'ASE',
        'difficulty_level': 'advanced',
        'duration_weeks': 6,
        'total_modules': 3,
        'is_free': False,
        'is_published': True,
        'curriculum': {
            'sdg_objectives': 'Master advanced software development techniques and architectural patterns.',
            'learning_outcomes': 'Design scalable systems, implement design patterns, and understand enterprise software architecture.',
            'standards_aligned': 'IEEE Software Engineering Standards',
        },
        'modules': [
            {
                'title': 'Design Patterns and Architecture',
                'description': 'Learn essential design patterns and architectural principles for building robust software.',
                'order': 1,
                'lessons': [
                    {
                        'title': 'Introduction to Design Patterns',
                        'description': 'Understand what design patterns are and why they matter.',
                        'content': 'Design patterns are proven solutions to common software design problems that improve code reusability and maintainability.',
                        'lesson_type': 'text',
                        'order': 1,
                        'duration_minutes': 20,
                    },
                    {
                        'title': 'Creational Patterns',
                        'description': 'Explore patterns for object creation like Singleton, Factory, and Builder.',
                        'content': 'Creational patterns control how objects are created, providing flexibility in instantiation.',
                        'lesson_type': 'video',
                        'order': 2,
                        'duration_minutes': 25,
                    },
                ],
                'quiz': {
                    'title': 'Design Patterns Quiz',
                    'description': 'Test your knowledge of design patterns and architecture.',
                    'passing_score': 75,
                    'is_timed': False,
                    'max_attempts': 3,
                    'questions': [
                        {
                            'question_text': 'What is the main purpose of design patterns?',
                            'question_type': 'multiple_choice',
                            'correct_answer': 'Provide reusable solutions to common problems',
                            'order': 1,
                            'points': 1,
                            'difficulty': 'medium',
                            'options': [
                                'Make code run faster',
                                'Provide reusable solutions to common problems',
                                'Reduce code length',
                                'Make code harder to understand',
                            ],
                        },
                    ],
                },
            },
        ],
    },
]

class Command(BaseCommand):
    help = 'Seed cause courses, modules, lessons, and quizzes for HCI, Software Engineering, and Project Management.'

    def handle(self, *args, **options):
        for course_data in COURSES:
            course, course_created = Course.objects.get_or_create(
                slug=course_data['slug'],
                defaults={
                    'title': course_data['title'],
                    'description': course_data['description'],
                    'course_type': course_data['course_type'],
                    'difficulty_level': course_data['difficulty_level'],
                    'duration_weeks': course_data['duration_weeks'],
                    'total_modules': course_data['total_modules'],
                    'is_free': course_data['is_free'],
                    'is_published': course_data['is_published'],
                }
            )

            if not course_created:
                course.title = course_data['title']
                course.description = course_data['description']
                course.course_type = course_data['course_type']
                course.difficulty_level = course_data['difficulty_level']
                course.duration_weeks = course_data['duration_weeks']
                course.total_modules = course_data['total_modules']
                course.is_free = course_data['is_free']
                course.is_published = course_data['is_published']
                course.save()

            curriculum, _ = CurriculumMapping.objects.get_or_create(
                course=course,
                defaults=course_data['curriculum']
            )
            curriculum.sdg_objectives = course_data['curriculum']['sdg_objectives']
            curriculum.learning_outcomes = course_data['curriculum']['learning_outcomes']
            curriculum.standards_aligned = course_data['curriculum']['standards_aligned']
            curriculum.save()

            for module_data in course_data['modules']:
                module, _ = Module.objects.get_or_create(
                    course=course,
                    order=module_data['order'],
                    defaults={
                        'title': module_data['title'],
                        'description': module_data['description'],
                        'is_locked': False,
                        'unlock_score': 0,
                    }
                )
                module.title = module_data['title']
                module.description = module_data['description']
                module.is_locked = False
                module.unlock_score = 0
                module.save()

                for lesson_data in module_data['lessons']:
                    lesson, _ = Lesson.objects.get_or_create(
                        module=module,
                        order=lesson_data['order'],
                        defaults={
                            'title': lesson_data['title'],
                            'description': lesson_data['description'],
                            'content': lesson_data['content'],
                            'lesson_type': lesson_data['lesson_type'],
                            'duration_minutes': lesson_data['duration_minutes'],
                        }
                    )
                    lesson.title = lesson_data['title']
                    lesson.description = lesson_data['description']
                    lesson.content = lesson_data['content']
                    lesson.lesson_type = lesson_data['lesson_type']
                    lesson.duration_minutes = lesson_data['duration_minutes']
                    lesson.save()

                quiz_data = module_data['quiz']
                quiz, _ = Quiz.objects.get_or_create(
                    module=module,
                    defaults={
                        'title': quiz_data['title'],
                        'description': quiz_data['description'],
                        'passing_score': quiz_data['passing_score'],
                        'time_limit_minutes': quiz_data.get('time_limit_minutes', 0),
                        'max_attempts': quiz_data['max_attempts'],
                        'is_timed': quiz_data['is_timed'],
                    }
                )
                quiz.title = quiz_data['title']
                quiz.description = quiz_data['description']
                quiz.passing_score = quiz_data['passing_score']
                quiz.time_limit_minutes = quiz_data.get('time_limit_minutes', 0)
                quiz.max_attempts = quiz_data['max_attempts']
                quiz.is_timed = quiz_data['is_timed']
                quiz.save()

                for question_data in quiz_data['questions']:
                    question, _ = Question.objects.get_or_create(
                        quiz=quiz,
                        order=question_data['order'],
                        defaults={
                            'question_text': question_data['question_text'],
                            'question_type': question_data['question_type'],
                            'correct_answer': question_data['correct_answer'],
                            'explanation': question_data.get('explanation', ''),
                            'points': question_data['points'],
                            'difficulty': question_data['difficulty'],
                        }
                    )
                    question.question_text = question_data['question_text']
                    question.question_type = question_data['question_type']
                    question.correct_answer = question_data['correct_answer']
                    question.explanation = question_data.get('explanation', '')
                    question.points = question_data['points']
                    question.difficulty = question_data['difficulty']
                    question.save()

                    if question_data['question_type'] == 'multiple_choice':
                        for idx, option_text in enumerate(question_data['options'], start=1):
                            option, _ = QuestionOption.objects.get_or_create(
                                question=question,
                                order=idx,
                                defaults={
                                    'option_text': option_text,
                                    'is_correct': option_text == question_data['correct_answer'],
                                }
                            )
                            option.option_text = option_text
                            option.is_correct = option_text == question_data['correct_answer']
                            option.save()

            self.stdout.write(self.style.SUCCESS(f"Seeded course: {course.title}"))

        self.stdout.write(self.style.SUCCESS('Cause courses seeded successfully.'))
