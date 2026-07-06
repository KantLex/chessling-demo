import { useState, useCallback, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from './Chessboard';
import { allLessons } from './exercises';
import { COLOR_MAP, type Lesson, type Exercise, type BoardAnnotations, type HighlightColor } from './types';

// ─── Helper: UCI move to SAN ───────────────────────────────

function uciToSan(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen);
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const move = chess.move({ from, to, promotion: 'q' });
    return move?.san || uci;
  } catch {
    return uci;
  }
}

// ─── Particles for celebration ─────────────────────────────

function ParticleBurst({ color, square, boardSize }: { color: string; square: string; boardSize: number }) {
  const cellSize = boardSize / 8;
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]);
  const x = file * cellSize + cellSize / 2;
  const y = (8 - rank) * cellSize + cellSize / 2;
  
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 40 + Math.random() * 30;
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        delay: Math.random() * 0.1,
      };
    });
  }, []);
  
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: color,
            animation: `particleBurst 0.6s ease-out forwards`,
            animationDelay: `${p.delay}s`,
            // @ts-expect-error CSS custom props
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Hearts display ────────────────────────────────────────

function Hearts({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: 18,
            filter: i < count ? 'none' : 'grayscale(1) opacity(0.3)',
            transition: 'all 0.3s',
            animation: i === count && count < max ? 'heartBreak 0.4s ease-out' : undefined,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

// ─── Concept Card (pre-lesson intro) ───────────────────────

function ConceptCardView({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const [moveIndex, setMoveIndex] = useState(0);
  const { conceptCard } = lesson;
  
  // Auto-play animation
  useEffect(() => {
    if (conceptCard.animationMoves.length === 0) return;
    const interval = setInterval(() => {
      setMoveIndex(i => (i + 1) % (conceptCard.animationMoves.length + 2));
    }, 2000);
    return () => clearInterval(interval);
  }, [conceptCard.animationMoves.length]);
  
  // Build FEN after animated moves
  const currentFen = useMemo(() => {
    if (moveIndex === 0 || conceptCard.animationMoves.length === 0) {
      return conceptCard.animationFen;
    }
    try {
      const chess = new Chess(conceptCard.animationFen);
      for (let i = 0; i < Math.min(moveIndex, conceptCard.animationMoves.length); i++) {
        const uci = conceptCard.animationMoves[i];
        chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: 'q' });
      }
      return chess.fen();
    } catch {
      return conceptCard.animationFen;
    }
  }, [moveIndex, conceptCard]);
  
  const showAnnotations = moveIndex >= conceptCard.animationMoves.length;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 20,
      background: conceptCard.gradient,
    }}>
      <div style={{
        background: 'rgba(15, 15, 26, 0.85)',
        borderRadius: 24,
        padding: 32,
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Animated mini board */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Chessboard
            fen={currentFen}
            annotations={showAnnotations ? conceptCard.animationAnnotations : undefined}
            interactive={false}
            showCoordinates={false}
          />
        </div>
        
        <div style={{ fontSize: 48, marginBottom: 8 }}>{conceptCard.icon}</div>
        <h1 style={{
          fontFamily: 'Outfit, system-ui',
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 12,
          background: conceptCard.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {conceptCard.title}
        </h1>
        <p style={{
          fontSize: 16,
          color: '#A0A0B5',
          lineHeight: 1.5,
          marginBottom: 24,
        }}>
          {conceptCard.description}
        </p>
        
        <button
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #00D9A3, #00B8D9)',
            color: '#0F0F1A',
            border: 'none',
            borderRadius: 16,
            padding: '14px 32px',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 217, 163, 0.3)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Start Lesson →
        </button>
      </div>
    </div>
  );
}

// ─── Exercise Player ───────────────────────────────────────

type FeedbackState = 'none' | 'correct' | 'incorrect';

function ExercisePlayer({
  exercise,
  index,
  total,
  hearts,
  onAnswer,
  onNext,
  onHint,
  hintLevel,
  showAnswer,
}: {
  exercise: Exercise;
  index: number;
  total: number;
  hearts: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  onHint: () => void;
  hintLevel: number;
  showAnswer: boolean;
}) {
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [selectedFen, setSelectedFen] = useState(exercise.fen);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [boardShake, setBoardShake] = useState(false);
  const [particles, setParticles] = useState<{ color: string; square: string } | null>(null);
  
  // Reset when exercise changes
  useEffect(() => {
    setFeedback('none');
    setSelectedFen(exercise.fen);
    setLastMove(null);
    setShowWhy(false);
    setBoardShake(false);
    setParticles(null);
  }, [exercise.id]);
  
  const handleMove = useCallback((from: string, to: string) => {
    const uci = from + to;
    const isCorrect = exercise.correctMoves.includes(uci);
    
    // Apply the move visually
    try {
      const chess = new Chess(exercise.fen);
      chess.move({ from, to, promotion: 'q' });
      setSelectedFen(chess.fen());
    } catch {
      // If move fails, keep original FEN
    }
    setLastMove({ from, to });
    
    if (isCorrect) {
      setFeedback('correct');
      setParticles({ color: '#00D9A3', square: to });
      onAnswer(true);
    } else {
      setFeedback('incorrect');
      setBoardShake(true);
      setParticles({ color: '#FF5757', square: to });
      onAnswer(false);
      setTimeout(() => {
        setBoardShake(false);
        // Reset board to original position after showing wrong move
        setTimeout(() => {
          setSelectedFen(exercise.fen);
          setLastMove(null);
        }, 600);
      }, 400);
    }
  }, [exercise, onAnswer]);
  
  // Determine which annotations to show
  const displayAnnotations: BoardAnnotations | undefined = useMemo(() => {
    if (feedback === 'correct') {
      return exercise.feedbackCorrect.boardAnnotations;
    } else if (feedback === 'incorrect') {
      const anno = exercise.feedbackIncorrect.boardAnnotations;
      if (exercise.feedbackIncorrect.showCorrectPulse && exercise.bestMove) {
        // Add correct square pulse
        const correctTo = exercise.bestMove.slice(2, 4);
        return {
          ...anno,
          highlights: [
            ...(anno.highlights || []),
            { square: correctTo, color: 'good' as HighlightColor, pulse: true, label: 'Correct' },
          ],
        };
      }
      return anno;
    } else if (showAnswer) {
      // Show answer mode
      if (exercise.bestMove) {
        const correctTo = exercise.bestMove.slice(2, 4);
        return {
          highlights: [
            { square: correctTo, color: 'good' as HighlightColor, pulse: true, label: 'Answer', badge: '✓' },
          ],
        };
      }
    } else if (hintLevel > 0) {
      // Show visual hints based on hint level
      const hint = exercise.hints.find(h => h.level === hintLevel);
      if (hint) {
        if (hint.action === 'glow-squares' && hint.squares) {
          return {
            highlights: hint.squares.map(s => ({
              square: s,
              color: (hint.color || 'attention') as HighlightColor,
              pulse: true,
            })),
          };
        } else if (hint.action === 'pulse-square' && hint.squares) {
          return {
            highlights: hint.squares.map(s => ({
              square: s,
              color: (hint.color || 'attention') as HighlightColor,
              pulse: true,
            })),
          };
        }
      }
    }
    return exercise.visualHints;
  }, [feedback, showAnswer, hintLevel, exercise]);
  
  const isInteractive = feedback === 'none' && !showAnswer;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '12px',
      maxWidth: 500,
      margin: '0 auto',
    }}>
      {/* Header: back, title, hearts, progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 16, color: '#A0A0B5', fontWeight: 600 }}>
          {exercise.conceptTag.replace(/_/g, ' ')}
        </span>
        <Hearts count={hearts} />
      </div>
      
      {/* Progress bar */}
      <div style={{
        height: 6,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        marginBottom: 16,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${((index + (feedback !== 'none' ? 1 : 0)) / total) * 100}%`,
          background: 'linear-gradient(90deg, #00D9A3, #00B8D9)',
          borderRadius: 3,
          transition: 'width 0.4s ease-out',
        }} />
      </div>
      
      <span style={{ fontSize: 13, color: '#6B6B85', marginBottom: 12 }}>
        Exercise {index + 1} of {total}
      </span>
      
      {/* Question prompt */}
      <div style={{
        background: '#1A1A2E',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 16,
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, color: '#F0F0F5' }}>
          {exercise.questionPrompt}
        </p>
        {isInteractive && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {hintLevel < exercise.hints.length && (
              <button
                onClick={onHint}
                style={{
                  background: 'rgba(255, 217, 61, 0.15)',
                  color: '#FFD93D',
                  border: '1px solid rgba(255, 217, 61, 0.3)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                💡 Hint {hintLevel > 0 ? `(${hintLevel}/${exercise.hints.length})` : ''}
              </button>
            )}
            <span style={{ fontSize: 13, color: '#6B6B85', alignSelf: 'center' }}>
              Tap a piece, then tap a square
            </span>
          </div>
        )}
      </div>
      
      {/* Chessboard */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 16,
          animation: boardShake ? 'shake 0.3s ease-out' : undefined,
        }}
      >
        <Chessboard
          fen={selectedFen}
          annotations={displayAnnotations}
          onMove={handleMove}
          interactive={isInteractive}
          lastMove={lastMove}
        />
        {particles && (
          <ParticleBurst color={particles.color} square={particles.square} boardSize={400} />
        )}
      </div>
      
      {/* Feedback card */}
      {feedback === 'correct' && (
        <div className="animate-slide-up" style={{
          background: 'linear-gradient(135deg, rgba(0, 217, 163, 0.1), rgba(0, 184, 217, 0.05))',
          border: '1px solid rgba(0, 217, 163, 0.3)',
          borderRadius: 16,
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24, animation: 'starBurst 0.6s ease-out' }}>✅</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#00D9A3' }}>Correct!</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: '#D0D0E0', marginBottom: 10 }}>
            {exercise.feedbackCorrect.short}
          </p>
          
          {showWhy && exercise.feedbackCorrect.why && (
            <div className="animate-fade-in" style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 10,
              padding: 12,
              marginTop: 8,
              marginBottom: 8,
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#B0B0C5' }}>
                {exercise.feedbackCorrect.why}
              </p>
              {exercise.feedbackCorrect.quote && (
                <p style={{
                  fontSize: 13,
                  color: '#FFD93D',
                  fontStyle: 'italic',
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {exercise.feedbackCorrect.quote}
                </p>
              )}
            </div>
          )}
          
          {exercise.feedbackCorrect.why && !showWhy && (
            <button
              onClick={() => setShowWhy(true)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#5B9BD5',
                border: '1px solid rgba(91, 155, 213, 0.3)',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 8,
              }}
            >
              Why? ▼
            </button>
          )}
          
          <button
            onClick={onNext}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #00D9A3, #00B8D9)',
              color: '#0F0F1A',
              border: 'none',
              borderRadius: 12,
              padding: '12px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Continue →
          </button>
        </div>
      )}
      
      {feedback === 'incorrect' && (
        <div className="animate-slide-up" style={{
          background: 'linear-gradient(135deg, rgba(255, 87, 87, 0.1), rgba(255, 140, 66, 0.05))',
          border: '1px solid rgba(255, 87, 87, 0.3)',
          borderRadius: 16,
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>❌</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#FF5757' }}>Not quite</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: '#D0D0E0', marginBottom: 12 }}>
            {exercise.feedbackIncorrect.short}
          </p>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setFeedback('none');
                setSelectedFen(exercise.fen);
                setLastMove(null);
              }}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                color: '#F0F0F5',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '10px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => setShowWhy(true)}
              style={{
                flex: 1,
                background: 'rgba(255, 217, 61, 0.15)',
                color: '#FFD93D',
                border: '1px solid rgba(255, 217, 61, 0.3)',
                borderRadius: 10,
                padding: '10px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Show Me ▼
            </button>
          </div>
          
          {showWhy && (
            <div className="animate-fade-in" style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 10,
              padding: 12,
              marginTop: 10,
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#B0B0C5' }}>
                {exercise.feedbackIncorrect.short}
              </p>
              {exercise.bestMove && (
                <p style={{ fontSize: 14, color: '#00D9A3', marginTop: 8, fontWeight: 600 }}>
                  Best move: {uciToSan(exercise.fen, exercise.bestMove)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Show answer mode */}
      {showAnswer && feedback === 'none' && (
        <div className="animate-fade-in" style={{
          background: 'rgba(255, 217, 61, 0.1)',
          border: '1px solid rgba(255, 217, 61, 0.3)',
          borderRadius: 16,
          padding: 16,
        }}>
          <p style={{ fontSize: 15, color: '#FFD93D', marginBottom: 8, fontWeight: 600 }}>
            💡 Answer revealed
          </p>
          {exercise.hints.find(h => h.level === exercise.hints.length)?.explanation && (
            <p style={{ fontSize: 14, color: '#B0B0C5', lineHeight: 1.5, marginBottom: 12 }}>
              {exercise.hints.find(h => h.level === exercise.hints.length)?.explanation}
            </p>
          )}
          <button
            onClick={onNext}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              color: '#F0F0F5',
              border: 'none',
              borderRadius: 10,
              padding: '10px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Lesson Complete Screen ────────────────────────────────

function LessonComplete({ lesson, xp, perfect, onContinue }: {
  lesson: Lesson;
  xp: number;
  perfect: boolean;
  onContinue: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 20,
      background: perfect
        ? 'linear-gradient(135deg, rgba(255, 217, 61, 0.15), rgba(0, 217, 163, 0.1))'
        : 'linear-gradient(135deg, rgba(0, 217, 163, 0.1), rgba(0, 184, 217, 0.05))',
    }}>
      {perfect && (
        <div style={{
          fontSize: 60,
          marginBottom: 16,
          animation: 'starBurst 0.8s ease-out',
        }}>
          🏆
        </div>
      )}
      <div style={{
        fontSize: 48,
        marginBottom: 12,
        animation: 'starBurst 0.6s ease-out',
      }}>
        {lesson.icon}
      </div>
      <h1 style={{
        fontFamily: 'Outfit, system-ui',
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 8,
        color: '#00D9A3',
      }}>
        Lesson Complete!
      </h1>
      <p style={{ fontSize: 18, color: '#A0A0B5', marginBottom: 24 }}>
        {lesson.title}
      </p>
      
      <div style={{
        display: 'flex',
        gap: 24,
        marginBottom: 32,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#FFD93D' }}>+{xp}</div>
          <div style={{ fontSize: 13, color: '#6B6B85' }}>XP earned</div>
        </div>
        {perfect && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32 }}>⭐</div>
            <div style={{ fontSize: 13, color: '#6B6B85' }}>Perfect!</div>
          </div>
        )}
      </div>
      
      <button
        onClick={onContinue}
        style={{
          background: 'linear-gradient(135deg, #00D9A3, #00B8D9)',
          color: '#0F0F1A',
          border: 'none',
          borderRadius: 16,
          padding: '14px 40px',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 217, 163, 0.3)',
        }}
      >
        Continue →
      </button>
    </div>
  );
}

// ─── Home Screen (Skill Tree) ──────────────────────────────

function HomeScreen({ lessons, onSelectLesson, xp, streak }: {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  xp: number;
  streak: number;
}) {
  return (
    <div style={{
      maxWidth: 500,
      margin: '0 auto',
      padding: '16px 12px',
      minHeight: '100vh',
    }}>
      {/* Top bar: streak + XP */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 87, 87, 0.15)',
          padding: '6px 14px',
          borderRadius: 20,
          border: '1px solid rgba(255, 87, 87, 0.3)',
        }}>
          <span style={{ fontSize: 18, animation: 'flameFlicker 2s ease-in-out infinite' }}>🔥</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#FF5757' }}>{streak}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255, 217, 61, 0.15)',
          padding: '6px 14px',
          borderRadius: 20,
          border: '1px solid rgba(255, 217, 61, 0.3)',
        }}>
          <span style={{ fontSize: 16 }}>⭐</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#FFD93D' }}>{xp}</span>
        </div>
      </div>
      
      {/* App title */}
      <h1 style={{
        fontFamily: 'Outfit, system-ui',
        fontSize: 32,
        fontWeight: 800,
        textAlign: 'center',
        marginBottom: 8,
        background: 'linear-gradient(135deg, #00D9A3, #00B8D9)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Chessling
      </h1>
      <p style={{
        textAlign: 'center',
        fontSize: 14,
        color: '#6B6B85',
        marginBottom: 32,
      }}>
        Learn chess strategy, one move at a time
      </p>
      
      {/* Skill tree */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {lessons.map((lesson, i) => {
          const isUnlocked = i === 0; // First lesson unlocked for demo
          const isAvailable = isUnlocked;
          
          return (
            <div key={lesson.id}>
              {/* Connecting line */}
              {i < lessons.length - 1 && (
                <div style={{
                  width: 2,
                  height: 24,
                  background: isAvailable ? 'rgba(0, 217, 163, 0.3)' : 'rgba(255,255,255,0.1)',
                  margin: '0 auto',
                }} />
              )}
              
              {/* Lesson node */}
              <button
                onClick={() => isAvailable && onSelectLesson(lesson)}
                disabled={!isAvailable}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  padding: 0,
                  opacity: isAvailable ? 1 : 0.4,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (isAvailable) e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: isAvailable
                    ? 'linear-gradient(135deg, rgba(0, 217, 163, 0.2), rgba(0, 184, 217, 0.1))'
                    : 'rgba(255,255,255,0.05)',
                  border: isAvailable
                    ? '2px solid rgba(0, 217, 163, 0.4)'
                    : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  boxShadow: isAvailable
                    ? '0 4px 20px rgba(0, 217, 163, 0.15)'
                    : 'none',
                  animation: isAvailable && i === 0 ? 'pulse-strong 2s ease-in-out infinite' : undefined,
                }}>
                  {isAvailable ? lesson.icon : '🔒'}
                </div>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isAvailable ? '#F0F0F5' : '#6B6B85',
                }}>
                  {lesson.title}
                </span>
                <span style={{
                  fontSize: 12,
                  color: '#6B6B85',
                }}>
                  {lesson.exercises.length} exercises
                </span>
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Footer hint */}
      <div style={{
        textAlign: 'center',
        marginTop: 40,
        padding: 16,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ fontSize: 13, color: '#6B6B85' }}>
          🎯 3 lessons available in this demo · ~9 exercises total
        </p>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────

type Screen = 'home' | 'concept-card' | 'exercise' | 'lesson-complete';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [streak] = useState(7);
  const [hintLevel, setHintLevel] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lessonStats, setLessonStats] = useState({ correct: 0, total: 0, firstTry: 0 });
  
  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setExerciseIndex(0);
    setHintLevel(0);
    setShowAnswer(false);
    setLessonStats({ correct: 0, total: lesson.exercises.length, firstTry: 0 });
    setScreen('concept-card');
  };
  
  const handleStartLesson = () => {
    setScreen('exercise');
  };
  
  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setLessonStats(s => ({ ...s, correct: s.correct + 1, firstTry: s.firstTry + 1 }));
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
  };
  
  const handleHint = () => {
    if (hintLevel < (currentLesson?.exercises[exerciseIndex].hints.length || 0)) {
      const newLevel = hintLevel + 1;
      setHintLevel(newLevel);
      if (newLevel === (currentLesson?.exercises[exerciseIndex].hints.length || 0)) {
        setShowAnswer(true);
      }
    }
  };
  
  const handleNext = () => {
    if (!currentLesson) return;
    
    if (exerciseIndex + 1 < currentLesson.exercises.length) {
      setExerciseIndex(i => i + 1);
      setHintLevel(0);
      setShowAnswer(false);
    } else {
      // Lesson complete
      const perfect = lessonStats.firstTry === lessonStats.total;
      const earnedXp = perfect ? 15 : 10;
      setXp(x => x + earnedXp);
      setScreen('lesson-complete');
    }
  };
  
  const handleContinue = () => {
    setScreen('home');
    setCurrentLesson(null);
    setExerciseIndex(0);
    setHearts(5);
  };
  
  // Render
  if (screen === 'home') {
    return <HomeScreen lessons={allLessons} onSelectLesson={handleSelectLesson} xp={xp} streak={streak} />;
  }
  
  if (!currentLesson) {
    return <HomeScreen lessons={allLessons} onSelectLesson={handleSelectLesson} xp={xp} streak={streak} />;
  }
  
  if (screen === 'concept-card') {
    return <ConceptCardView lesson={currentLesson} onStart={handleStartLesson} />;
  }
  
  if (screen === 'exercise') {
    const exercise = currentLesson.exercises[exerciseIndex];
    return (
      <ExercisePlayer
        exercise={exercise}
        index={exerciseIndex}
        total={currentLesson.exercises.length}
        hearts={hearts}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onHint={handleHint}
        hintLevel={hintLevel}
        showAnswer={showAnswer}
      />
    );
  }
  
  if (screen === 'lesson-complete') {
    const perfect = lessonStats.firstTry === lessonStats.total;
    return (
      <LessonComplete
        lesson={currentLesson}
        xp={perfect ? 15 : 10}
        perfect={perfect}
        onContinue={handleContinue}
      />
    );
  }
  
  return <HomeScreen lessons={allLessons} onSelectLesson={handleSelectLesson} xp={xp} streak={streak} />;
}