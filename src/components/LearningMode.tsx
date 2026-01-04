import { useState } from 'react';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { genres } from '../data/genres';
import { useToast } from '../hooks/useToast';
import './LearningMode.css';

type LessonType = 'tutorial' | 'quiz';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  quiz?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const lessons: Lesson[] = [
  {
    id: 'intro',
    title: 'Introduction to Music Genres',
    type: 'tutorial',
    content: `
      <h3>What is a music genre?</h3>
      <p>A music genre is a category that identifies musical pieces that share a tradition or set of conventions. Genres help organize and understand music.</p>
      
      <h3>Genre Characteristics</h3>
      <ul>
        <li><strong>Instrumentation:</strong> The typical instruments used</li>
        <li><strong>Rhythm and tempo:</strong> The speed and rhythmic pattern</li>
        <li><strong>Harmony:</strong> The chord structure</li>
        <li><strong>Historical origin:</strong> When and where it emerged</li>
        <li><strong>Cultural influences:</strong> What cultures influenced it</li>
      </ul>
      
      <h3>Exploring genres</h3>
      <p>In this app you can explore more than 30 different genres, from classic rock to modern electronic music. Each genre has its own history and unique characteristics.</p>
    `,
  },
  {
    id: 'rock-history',
    title: 'History of Rock',
    type: 'tutorial',
    content: `
      <h3>Origins of Rock (1950s)</h3>
      <p>Rock was born from the fusion of rhythm and blues, country, and gospel. Artists like Chuck Berry and Elvis Presley were pioneers.</p>
      
      <h3>The Golden Era (1960s-1970s)</h3>
      <p>Bands like The Beatles, Led Zeppelin, and The Rolling Stones took rock to new heights, creating subgenres like psychedelic rock and hard rock.</p>
      
      <h3>Modern Evolution (1980s-present)</h3>
      <p>Rock evolved in multiple directions: alternative rock, grunge, indie rock, and more. Each decade brought new innovations.</p>
      
      <h3>Rock Subgenres</h3>
      <ul>
        <li><strong>Classic Rock:</strong> The foundational sound of the 60s-80s</li>
        <li><strong>Alternative Rock:</strong> Non-mainstream rock from the 80s-90s</li>
        <li><strong>Punk:</strong> Fast and rebellious music from the 70s</li>
        <li><strong>Hard Rock:</strong> Heavier and more aggressive rock</li>
      </ul>
    `,
  },
  {
    id: 'electronic-music',
    title: 'Electronic Music',
    type: 'tutorial',
    content: `
      <h3>What is electronic music?</h3>
      <p>Electronic music is music created using electronic instruments, synthesizers, and digital technology. It emerged in the 70s and became popular in the 80s.</p>
      
      <h3>Main Genres</h3>
      <ul>
        <li><strong>House:</strong> Dance music with 4/4 rhythm, originated in Chicago</li>
        <li><strong>Techno:</strong> Repetitive and mechanical music, originated in Detroit</li>
        <li><strong>Ambient:</strong> Atmospheric and environmental music, perfect for relaxation</li>
      </ul>
      
      <h3>Common Characteristics</h3>
      <p>Electronic music is characterized by:</p>
      <ul>
        <li>Extensive use of synthesizers</li>
        <li>Programmed rhythms (drum machines)</li>
        <li>Repetition and loops</li>
        <li>Focus on dance and experience</li>
      </ul>
    `,
  },
  {
    id: 'quiz-basics',
    title: 'Quiz: Genre Fundamentals',
    type: 'quiz',
    quiz: [
      {
        id: 'q1',
        question: 'What primarily characterizes the House genre?',
        options: [
          '4/4 rhythm and focus on dance',
          'Distorted guitars and aggressive vocals',
          'Acoustic instruments and soft melodies',
          'Complex rhythms and traditional percussion',
        ],
        correct: 0,
        explanation: 'House is characterized by its constant 4/4 rhythm and focus on dance music, originated in Chicago in the 80s.',
      },
      {
        id: 'q2',
        question: 'In which decade did Punk emerge?',
        options: ['1950s', '1960s', '1970s', '1980s'],
        correct: 2,
        explanation: 'Punk emerged in the 1970s as a reaction against commercial rock, with bands like The Ramones and Sex Pistols.',
      },
      {
        id: 'q3',
        question: 'Which of these is NOT a Rock subgenre?',
        options: ['Classic Rock', 'House', 'Alternative Rock', 'Hard Rock'],
        correct: 1,
        explanation: 'House is an electronic music genre, not a rock subgenre. Classic Rock, Alternative Rock, and Hard Rock are all rock subgenres.',
      },
      {
        id: 'q4',
        question: 'What instrument is most characteristic of Jazz?',
        options: ['Electric guitar', 'Saxophone', 'Synthesizer', 'Electronic drums'],
        correct: 1,
        explanation: 'The saxophone is one of the most characteristic instruments of jazz, especially in styles like bebop and modern jazz.',
      },
      {
        id: 'q5',
        question: 'What characterizes the Ambient genre?',
        options: [
          'Fast and energetic rhythms',
          'Atmospheric and relaxing music',
          'Aggressive vocals and distortion',
          'Complex melodies and virtuosity',
        ],
        correct: 1,
        explanation: 'Ambient is characterized by being atmospheric, environmental, and relaxing music, perfect for creating moods and atmospheres.',
      },
    ],
  },
];

export const LearningMode = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const { progress, completeLesson, addQuizScore, isLessonCompleted, getQuizScore: getStoredQuizScore, getProgressPercentage, unlockBadge } = useLearningProgress();
  const { success, info } = useToast();

  const currentLesson = lessons[currentLessonIndex];
  const isQuiz = currentLesson.type === 'quiz';
  const isCompleted = isLessonCompleted(currentLesson.id);

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setQuizAnswers({});
      setShowResults(false);
    } else {
      success('You have completed all tutorials!');
      unlockBadge('course-complete');
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setQuizAnswers({});
      setShowResults(false);
    }
  };

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      completeLesson(currentLesson.id);
      success('Lesson completed!');
      
      // Unlock badges
      if (progress.completedLessons.length === 0) {
        unlockBadge('first-lesson');
      }
      if (progress.completedLessons.length === lessons.length - 1) {
        unlockBadge('all-tutorials');
      }
    }
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentLesson.quiz) return;
    
    const totalQuestions = currentLesson.quiz.length;
    let correct = 0;
    
    currentLesson.quiz.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    
    const score = Math.round((correct / totalQuestions) * 100);
    addQuizScore(currentLesson.id, score);
    setShowResults(true);
    
    if (score >= 80) {
      success(`Excellent! You got ${score}%`);
      unlockBadge('quiz-master');
    } else if (score >= 60) {
      info(`Good work! You got ${score}%`);
    } else {
      info(`You got ${score}%. Keep practicing!`);
    }
  };

  const calculateCurrentQuizScore = () => {
    if (!currentLesson.quiz || !showResults) return null;
    
    const totalQuestions = currentLesson.quiz.length;
    let correct = 0;
    
    currentLesson.quiz.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    
    return Math.round((correct / totalQuestions) * 100);
  };

  return (
    <div className="learning-mode">
      <div className="learning-header">
        <div>
          <h2>📚 Learning Mode</h2>
          <p>Learn about music genres interactively</p>
        </div>
        <div className="learning-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(lessons.length)}%` }}
            />
          </div>
          <span className="progress-text">
            {progress.completedLessons.length} / {lessons.length} completed
          </span>
        </div>
      </div>

      <div className="learning-content">
        <div className="lesson-card">
          <div className="lesson-header">
            <div className="lesson-badge">
              {isQuiz ? '❓ Quiz' : '📖 Tutorial'}
              {isCompleted && <span className="completed-badge">✓</span>}
            </div>
            <h3>{currentLesson.title}</h3>
            <div className="lesson-navigation">
              <button
                onClick={handlePrevious}
                disabled={currentLessonIndex === 0}
                className="nav-btn"
                type="button"
              >
                ← Previous
              </button>
              <span className="lesson-counter">
                {currentLessonIndex + 1} / {lessons.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentLessonIndex === lessons.length - 1}
                className="nav-btn"
                type="button"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="lesson-body">
            {isQuiz ? (
              <div className="quiz-container">
                {currentLesson.quiz?.map((question, qIndex) => {
                  const userAnswer = quizAnswers[question.id];
                  const isCorrect = userAnswer === question.correct;
                  
                  return (
                    <div key={question.id} className="quiz-question">
                      <h4>
                        {qIndex + 1}. {question.question}
                      </h4>
                      <div className="quiz-options">
                        {question.options.map((option, optIndex) => {
                          const isSelected = userAnswer === optIndex;
                          const showCorrect = showResults && optIndex === question.correct;
                          const showWrong = showResults && isSelected && !isCorrect;
                          
                          return (
                            <button
                              key={optIndex}
                              onClick={() => !showResults && handleQuizAnswer(question.id, optIndex)}
                              disabled={showResults}
                              className={`quiz-option ${
                                showCorrect ? 'correct' : ''
                              } ${
                                showWrong ? 'wrong' : ''
                              } ${
                                isSelected ? 'selected' : ''
                              }`}
                              type="button"
                            >
                              {option}
                              {showCorrect && <span className="check-mark">✓</span>}
                              {showWrong && <span className="x-mark">✗</span>}
                            </button>
                          );
                        })}
                      </div>
                      {showResults && (
                        <div className="quiz-explanation">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {!showResults ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length !== currentLesson.quiz?.length}
                    className="submit-quiz-btn"
                    type="button"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="quiz-results">
                    <div className="quiz-score">
                      <h3>Your score: {calculateCurrentQuizScore()}%</h3>
                      {calculateCurrentQuizScore()! >= 80 && (
                        <p className="quiz-congrats">Excellent work! 🎉</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        handleCompleteLesson();
                        if (currentLessonIndex < lessons.length - 1) {
                          setTimeout(() => handleNext(), 1000);
                        }
                      }}
                      className="continue-btn"
                      type="button"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="tutorial-content">
                <div 
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }} 
                  className="tutorial-html"
                />
                {!isCompleted && (
                  <button
                    onClick={handleCompleteLesson}
                    className="complete-lesson-btn"
                    type="button"
                  >
                    Mark as completed ✓
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="learning-sidebar">
          <div className="lessons-list">
            <h4>Lessons</h4>
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setCurrentLessonIndex(index);
                  setQuizAnswers({});
                  setShowResults(false);
                }}
                className={`lesson-item ${
                  currentLessonIndex === index ? 'active' : ''
                } ${
                  isLessonCompleted(lesson.id) ? 'completed' : ''
                }`}
                type="button"
              >
                <span className="lesson-icon">
                  {lesson.type === 'quiz' ? '❓' : '📖'}
                </span>
                <span className="lesson-title">{lesson.title}</span>
                {isLessonCompleted(lesson.id) && (
                  <span className="lesson-check">✓</span>
                )}
              </button>
            ))}
          </div>

          {progress.badges.length > 0 && (
            <div className="badges-section">
              <h4>Achievements</h4>
              <div className="badges-list">
                {progress.badges.map(badge => (
                  <div key={badge} className="badge-item">
                    {badge === 'first-lesson' && '🎯 First Lesson'}
                    {badge === 'all-tutorials' && '📚 All Tutorials'}
                    {badge === 'quiz-master' && '🏆 Quiz Master'}
                    {badge === 'course-complete' && '⭐ Course Complete'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
