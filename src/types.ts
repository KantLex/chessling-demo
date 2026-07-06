// Types for the Chessling visual teaching system

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  square: string;
}

// Visual annotation types

export type HighlightColor = 'good' | 'bad' | 'info' | 'attention' | 'plan' | 'prophylaxis';

export interface SquareHighlight {
  square: string;        // e.g. "d4"
  color: HighlightColor;
  label?: string;         // text label on the square
  badge?: string;         // emoji badge
  pulse?: boolean;        // pulsing animation
  glow?: boolean;         // glowing effect
}

export type ArrowType = 'move' | 'influence' | 'plan' | 'threat' | 'prophylaxis' | 'support';

export interface Arrow {
  from: string;
  to: string;
  type: ArrowType;
  color?: string;         // override default color
  animated?: boolean;     // draw-on animation
}

export interface PieceAnnotation {
  square: string;
  halo?: HighlightColor;      // glow around piece
  badge?: string;             // emoji badge above piece
  desaturate?: boolean;       // grayed out
  wobble?: boolean;           // wobble animation
}

export interface BoardAnnotations {
  highlights?: SquareHighlight[];
  arrows?: Arrow[];
  pieceAnnotations?: PieceAnnotation[];
  zones?: Zone[];
}

export interface Zone {
  squares: string[];
  color: HighlightColor;
  opacity?: number;
  label?: string;
}

// Exercise types

export type ExerciseType = 'concept-intro' | 'recognition' | 'decision' | 'comparison' | 'plan-formation';

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  fen: string;
  questionPrompt: string;
  correctMoves: string[];      // UCI format e.g. "g1f3"
  bestMove?: string;
  conceptTag: string;
  difficulty: number;
  
  // Visual hints shown before answering
  visualHints?: BoardAnnotations;
  
  // Feedback for correct answer
  feedbackCorrect: {
    short: string;
    why?: string;
    boardAnnotations: BoardAnnotations;
    quote?: string;
  };
  
  // Feedback for incorrect answer
  feedbackIncorrect: {
    short: string;
    showThreat?: boolean;
    boardAnnotations: BoardAnnotations;
    showCorrectPulse?: boolean;
  };
  
  // Progressive hints
  hints: Hint[];
  
  tags: string[];
}

export interface Hint {
  level: number;
  action: 'glow-area' | 'glow-squares' | 'pulse-square' | 'show-answer';
  area?: string;
  squares?: string[];
  move?: string;
  explanation?: string;
  color?: HighlightColor;
}

// Concept card (pre-lesson intro)

export interface ConceptCard {
  icon: string;
  title: string;
  gradient: string;
  description: string;
  animationFen: string;
  animationMoves: string[];   // sequence of moves to auto-play
  animationAnnotations: BoardAnnotations;
}

// Lesson

export interface Lesson {
  id: string;
  title: string;
  icon: string;
  conceptTag: string;
  description: string;
  exercises: Exercise[];
  conceptCard: ConceptCard;
}

// Gamification types

export type LessonState = 'locked' | 'available' | 'current' | 'completed' | 'perfect';

export interface SkillTreeNode {
  lessonId: string;
  title: string;
  icon: string;
  state: LessonState;
  isMasteryCheck?: boolean;
}

// Colors mapping

export const COLOR_MAP: Record<HighlightColor, string> = {
  good: '#00D9A3',
  bad: '#FF5757',
  info: '#5B9BD5',
  attention: '#FFD93D',
  plan: '#A855F7',
  prophylaxis: '#FF8C42',
};

export const ARROW_COLOR_MAP: Record<ArrowType, string> = {
  move: '#A855F7',
  influence: '#5B9BD5',
  plan: '#A855F7',
  threat: '#FF5757',
  prophylaxis: '#FF8C42',
  support: '#5B9BD5',
};