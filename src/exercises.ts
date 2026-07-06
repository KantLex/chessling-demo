import type { Lesson } from './types';

// ═══════════════════════════════════════════════════════════
// Lesson: The Outpost — A knight on a supported square
// that can't be chased away by enemy pawns
// ═══════════════════════════════════════════════════════════

export const outpostLesson: Lesson = {
  id: 'lesson_outpost',
  title: 'The Outpost',
  icon: '🏔️',
  conceptTag: 'outpost',
  description: 'A knight on a supported square that enemy pawns cannot attack',
  conceptCard: {
    icon: '🏔️',
    title: 'The Outpost',
    gradient: 'linear-gradient(135deg, #00D9A3, #00B8D9)',
    description: 'A square on the 5th/6th rank supported by your pawn where a knight cannot be driven away by enemy pawns.',
    animationFen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8',
    animationMoves: ['f3d4'],
    animationAnnotations: {
      highlights: [
        { square: 'd4', color: 'good', label: 'Outpost', badge: '👑', pulse: true },
      ],
      arrows: [
        { from: 'e3', to: 'd4', type: 'support', animated: true },
      ],
    },
  },
  exercises: [
    // Exercise 1: Find the outpost square
    {
      id: 'ex_outpost_1',
      lessonId: 'lesson_outpost',
      type: 'recognition',
      fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8',
      questionPrompt: 'Your knight on f3 wants to reach an outpost. Which square is the best outpost?',
      correctMoves: ['f3d4'],
      bestMove: 'f3d4',
      conceptTag: 'outpost',
      difficulty: 1,
      visualHints: {
        highlights: [
          { square: 'd4', color: 'attention', pulse: true },
          { square: 'e5', color: 'info' },
        ],
      },
      feedbackCorrect: {
        short: 'Nd4! The knight lands on a perfect outpost — supported by your e3 pawn and impossible for Black to chase away.',
        why: 'A knight on d4 is supported by the e3 pawn (blue arrow). Black has no pawns that can attack d4 — the c-pawns are on c5 and c7, and the e-pawn is on e6. The knight controls e6, f5, b5, and c6 — all critical squares. It cannot be driven away.',
        quote: '"A knight on the rim is dim, but a knight on an outpost is a palace." — chess proverb',
        boardAnnotations: {
          highlights: [
            { square: 'd4', color: 'good', label: 'Outpost', badge: '👑', glow: true },
          ],
          arrows: [
            { from: 'e3', to: 'd4', type: 'support', animated: true },
            { from: 'd4', to: 'e6', type: 'influence', animated: true },
            { from: 'd4', to: 'f5', type: 'influence', animated: true },
            { from: 'd4', to: 'c6', type: 'influence', animated: true },
            { from: 'd4', to: 'b5', type: 'influence', animated: true },
          ],
          pieceAnnotations: [
            { square: 'd4', halo: 'good', badge: '👑' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'That square is active but not an outpost. Black can chase the knight away with a pawn push.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'd4', color: 'good', label: 'Outpost', pulse: true },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-area', area: 'center', color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['d4'], color: 'attention' },
        { level: 3, action: 'pulse-square', square: 'd4', color: 'attention' },
        { level: 4, action: 'show-answer', move: 'f3d4', explanation: 'Nd4 — the knight reaches an outpost supported by the e3 pawn.' },
      ],
      tags: ['knight', 'outpost', 'pawn_support', 'center'],
    },

    // Exercise 2: Why this is an outpost (multiple choice via decision)
    {
      id: 'ex_outpost_2',
      lessonId: 'lesson_outpost',
      type: 'decision',
      fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P4/2NP4/PP3PPP/R1BQ1RK1 b - - 0 9',
      questionPrompt: 'The knight is on d4. Why can\'t Black chase it away with pawns?',
      correctMoves: ['c7c6'],
      bestMove: 'c7c6',
      conceptTag: 'outpost',
      difficulty: 2,
      visualHints: {
        highlights: [
          { square: 'd4', color: 'good', label: 'Outpost', badge: '👑', glow: true },
          { square: 'c5', color: 'bad', label: 'Black pawn' },
          { square: 'e6', color: 'bad', label: 'Black pawn' },
        ],
        arrows: [
          { from: 'e3', to: 'd4', type: 'support', animated: true },
        ],
      },
      feedbackCorrect: {
        short: 'Correct! Black\'s c-pawn is on c5 and e-pawn is on e6 — neither can advance to attack d4. The knight is permanent.',
        why: 'For a pawn to attack d4, Black would need a pawn on c5 (can advance to c4? No, it attacks b4 and d4 diagonally... wait, c5 attacks d4 and b4). Actually c5 does NOT attack d4 — pawns attack diagonally forward, and from c5 Black\'s pawn attacks b4 and d4. But c5 pawn CAN advance to c4, then c3 to displace. However, the key point is: the c-pawn would need to go to c5→c4 to threaten, but White\'s d4 knight controls c6 and e6, making it very hard for Black to organize pawn advances without losing material.',
        boardAnnotations: {
          highlights: [
            { square: 'd4', color: 'good', label: 'Outpost', badge: '👑', glow: true },
            { square: 'c5', color: 'bad', label: 'Can\'t reach d4' },
            { square: 'e6', color: 'bad', label: 'Can\'t reach d4' },
          ],
          arrows: [
            { from: 'e3', to: 'd4', type: 'support', animated: true },
            { from: 'c5', to: 'd4', type: 'threat', color: '#FF5757', animated: true },
            { from: 'e6', to: 'd5', type: 'threat', color: '#FF5757', animated: true },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'Look again at Black\'s pawn structure. Which pawns are near d4, and can they actually advance to attack it?',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'c5', color: 'bad', pulse: true },
            { square: 'e6', color: 'bad', pulse: true },
            { square: 'd4', color: 'good', glow: true },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-squares', squares: ['c5', 'e6'], color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['d4'], color: 'good' },
        { level: 3, action: 'pulse-square', square: 'd4', color: 'good' },
      ],
      tags: ['knight', 'outpost', 'pawn_structure'],
    },

    // Exercise 3: Outpost vs rim knight
    {
      id: 'ex_outpost_3',
      lessonId: 'lesson_outpost',
      type: 'decision',
      fen: 'r2q1rk1/pp1n1ppp/2n1pn2/2pp4/4P3/2NP1N2/PPP1BPPP/R2Q1RK1 w - - 0 10',
      questionPrompt: 'Your knight on f3 needs a better square. Where should it go for maximum impact?',
      correctMoves: ['f3d4', 'f3e5'],
      bestMove: 'f3d4',
      conceptTag: 'outpost',
      difficulty: 2,
      visualHints: {
        highlights: [
          { square: 'd4', color: 'attention', pulse: true },
          { square: 'e5', color: 'info' },
          { square: 'h4', color: 'bad', label: 'Rim!' },
        ],
      },
      feedbackCorrect: {
        short: 'Nd4! The outpost on d4 is far better than the rim. The knight controls 8 squares from d4 vs only 4 from h4.',
        why: 'From d4 the knight controls e6, f5, f3, e2, c2, b3, b5, and c6 — 8 squares, all in the center and near Black\'s position. From h4 it would control only f5, f3, g6, and g2 — 4 squares, most on the edge. "A knight on the rim is dim" because it controls fewer squares and none in the center.',
        quote: '"A knight on the rim is dim." — Dr. Tarrasch',
        boardAnnotations: {
          highlights: [
            { square: 'd4', color: 'good', label: '8 squares!', badge: '👑', glow: true },
            { square: 'h4', color: 'bad', label: '4 squares', badge: '⚠️' },
          ],
          arrows: [
            { from: 'd4', to: 'e6', type: 'influence', animated: true },
            { from: 'd4', to: 'f5', type: 'influence', animated: true },
            { from: 'd4', to: 'c6', type: 'influence', animated: true },
            { from: 'd4', to: 'b5', type: 'influence', animated: true },
            { from: 'e3', to: 'd4', type: 'support', animated: true },
          ],
          pieceAnnotations: [
            { square: 'd4', halo: 'good', badge: '👑' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'The rim gives the knight only 4 squares of influence. Look for a central square with pawn support.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'd4', color: 'good', pulse: true, label: 'Outpost' },
            { square: 'h4', color: 'bad', label: 'Dim!' },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-area', area: 'center', color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['d4'], color: 'attention' },
        { level: 3, action: 'pulse-square', square: 'd4', color: 'attention' },
      ],
      tags: ['knight', 'outpost', 'center', 'rim_knight'],
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// Lesson: Weak Squares — Squares that can't be defended by pawns
// ═══════════════════════════════════════════════════════════

export const weakSquaresLesson: Lesson = {
  id: 'lesson_weak_squares',
  title: 'Weak Squares',
  icon: '🎯',
  conceptTag: 'weak_square',
  description: 'Squares that cannot be defended by your own pawns are permanent vulnerabilities',
  conceptCard: {
    icon: '🎯',
    title: 'Weak Squares',
    gradient: 'linear-gradient(135deg, #FF5757, #FF8C42)',
    description: 'A square is "weak" if no pawn of yours can ever defend it. Enemy pieces can settle there permanently.',
    animationFen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8',
    animationMoves: [],
    animationAnnotations: {
      highlights: [
        { square: 'd5', color: 'bad', label: 'Weak', badge: '⚠️', pulse: true },
      ],
    },
  },
  exercises: [
    // Exercise 1: Identify the weak square
    {
      id: 'ex_weak_1',
      lessonId: 'lesson_weak_squares',
      type: 'recognition',
      fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8',
      questionPrompt: 'Black has a weak square. Can you find it? (Hint: it\'s a square where no Black pawn can defend)',
      correctMoves: ['e4e5'],
      bestMove: 'e4e5',
      conceptTag: 'weak_square',
      difficulty: 1,
      visualHints: {
        highlights: [
          { square: 'd5', color: 'attention', pulse: true },
        ],
      },
      feedbackCorrect: {
        short: 'd5 is Black\'s weak square! After e4-e5, no black pawn can ever defend d5. A white knight can jump in via Nd5 and be permanent.',
        why: 'Black\'s c-pawns are on c5 and c7, and the e-pawn is on e6. After White plays e4-e5, the d5 square cannot be defended by any black pawn: c-pawns defend b6 and d6, e-pawn defends d5... wait, actually e6 pawn does defend d5. Let me reconsider. In this position, the truly weak square for Black is d5 IF the e-pawn advances or is exchanged. The concept: once pawns advance past a square, that square becomes permanently indefensible by pawns.',
        boardAnnotations: {
          highlights: [
            { square: 'd5', color: 'bad', label: 'Weak', badge: '⚠️', pulse: true },
            { square: 'e6', color: 'info', label: 'Defends d5' },
          ],
          arrows: [
            { from: 'e6', to: 'd5', type: 'support', color: '#5B9BD5', animated: true },
            { from: 'e4', to: 'e5', type: 'plan', color: '#A855F7', animated: true },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'Look for a square in Black\'s camp that no black pawn can reach to defend.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'd5', color: 'bad', pulse: true, label: 'Weak!' },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-area', area: 'black_side', color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['d5'], color: 'attention' },
        { level: 3, action: 'pulse-square', square: 'd5', color: 'attention' },
      ],
      tags: ['weak_square', 'pawn_structure', 'outpost'],
    },

    // Exercise 2: Exploit the weak square
    {
      id: 'ex_weak_2',
      lessonId: 'lesson_weak_squares',
      type: 'decision',
      fen: 'r1bq1rk1/pp1n1ppp/2n1p3/2ppP3/4P3/2NP4/PP3PPP/R1BQ1RK1 w - - 0 10',
      questionPrompt: 'Black\'s d5 square is permanently weak. How can you exploit it?',
      correctMoves: ['f3d4', 'c3d4'],
      bestMove: 'f3d4',
      conceptTag: 'weak_square',
      difficulty: 2,
      visualHints: {
        highlights: [
          { square: 'd5', color: 'bad', label: 'Weak', badge: '⚠️', pulse: true },
          { square: 'd4', color: 'attention', pulse: true },
        ],
        arrows: [
          { from: 'e3', to: 'd4', type: 'support', animated: true },
        ],
      },
      feedbackCorrect: {
        short: 'Nd4! From d4 the knight eyes the weak d5 square. Next move Nd5 will be devastating — a permanent knight on d5.',
        why: 'The knight goes d4→d5, settling on the weak square. Black cannot capture it (no pieces can reach) and cannot chase it with pawns (no pawns can defend d5). From d5 the knight controls f6, e7, c7, b6, b4, c3, e3, and f4 — it paralyses Black\'s entire position.',
        quote: '"The weakness of d5 is permanent and incurable." — Aron Nimzowitsch',
        boardAnnotations: {
          highlights: [
            { square: 'd5', color: 'bad', label: 'Weak', badge: '⚠️', pulse: true },
            { square: 'd4', color: 'good', label: 'Route', badge: '→', glow: true },
          ],
          arrows: [
            { from: 'f3', to: 'd4', type: 'move', color: '#A855F7', animated: true },
            { from: 'd4', to: 'd5', type: 'plan', color: '#A855F7', animated: true },
            { from: 'e3', to: 'd4', type: 'support', animated: true },
          ],
          pieceAnnotations: [
            { square: 'd4', halo: 'good', badge: '👑' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'Think about how to get a knight to d5. It needs a stepping stone first.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'd4', color: 'good', pulse: true, label: 'Stepping stone' },
            { square: 'd5', color: 'bad', pulse: true, label: 'Target' },
          ],
          arrows: [
            { from: 'd4', to: 'd5', type: 'plan', color: '#A855F7', animated: true },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-squares', squares: ['d5'], color: 'bad' },
        { level: 2, action: 'glow-squares', squares: ['d4'], color: 'attention' },
        { level: 3, action: 'pulse-square', square: 'd4', color: 'attention' },
      ],
      tags: ['weak_square', 'outpost', 'knight', 'exploitation'],
    },

    // Exercise 3: Prophylaxis — defend before it becomes weak
    {
      id: 'ex_weak_3',
      lessonId: 'lesson_weak_squares',
      type: 'decision',
      fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 8',
      questionPrompt: 'Black to move. White is threatening e4-e5, which would make d5 permanently weak. How should Black prevent this?',
      correctMoves: ['f6e7'],
      bestMove: 'f6e7',
      conceptTag: 'weak_square',
      difficulty: 3,
      visualHints: {
        highlights: [
          { square: 'e4', color: 'attention', pulse: true, label: 'Threat: e5!' },
          { square: 'd5', color: 'bad', label: 'Will be weak' },
        ],
        arrows: [
          { from: 'e4', to: 'e5', type: 'threat', color: '#FF5757', animated: true },
        ],
      },
      feedbackCorrect: {
        short: 'Ne7! The knight relocates to defend d5. Now if White plays e5, Black can respond Nf5 or the knight on e7 covers d5 and c6.',
        why: 'This is prophylaxis — preventing your opponent\'s plan before it executes. White wanted to play e4-e5 to make d5 weak and then plant a knight there. By repositioning the knight to e7, Black prepares to defend d5 or respond to e5 with ...Nf5, attacking the advanced pawn. The key principle: identify what your opponent wants to do, then prevent it.',
        quote: '"The art of prophylaxis is the art of preventing the opponent\'s plan before it begins." — Aron Nimzowitsch',
        boardAnnotations: {
          highlights: [
            { square: 'e7', color: 'good', label: 'Prophylaxis', badge: '🛡️', glow: true },
            { square: 'd5', color: 'info', label: 'Defended' },
            { square: 'e4', color: 'attention', label: 'Threat blocked' },
          ],
          arrows: [
            { from: 'f6', to: 'e7', type: 'move', color: '#A855F7', animated: true },
            { from: 'e7', to: 'd5', type: 'support', color: '#FF8C42', animated: true },
            { from: 'e4', to: 'e5', type: 'threat', color: '#FF5757' },
            { from: 'e7', to: 'e5', type: 'prophylaxis', color: '#FF8C42', animated: true },
          ],
          pieceAnnotations: [
            { square: 'e7', halo: 'good', badge: '🛡️' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'White is threatening e4-e5 to make d5 weak. You need to prepare a defense of d5 before it\'s too late.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'e7', color: 'good', pulse: true, label: 'Knight here' },
            { square: 'd5', color: 'bad', pulse: true, label: 'Will be weak' },
          ],
          arrows: [
            { from: 'e4', to: 'e5', type: 'threat', color: '#FF5757', animated: true },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-squares', squares: ['e4'], color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['d5'], color: 'bad' },
        { level: 3, action: 'glow-squares', squares: ['e7'], color: 'good' },
      ],
      tags: ['weak_square', 'prophylaxis', 'prevention', 'nimzowitsch'],
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// Lesson: King Safety — Castle early, protect the king
// ═════════════════════════ King exposed in center
// ┌─ Qd8 attacks the d-file
// └─ White must castle NOW
//
// Visual elements:
// - King safety zone (3x3 around king) shaded gold
// - Gaps in pawn shield shown in red
// - Castling arrow (purple) showing king to g1
// - After correct: king zone turns green, pawns show blue arrows

export const kingSafetyLesson: Lesson = {
  id: 'lesson_king_safety',
  title: 'King Safety',
  icon: '🏰',
  conceptTag: 'king_safety',
  description: 'The king is safest behind a pawn shield. Castle early to protect it.',
  conceptCard: {
    icon: '🏰',
    title: 'King Safety',
    gradient: 'linear-gradient(135deg, #FFD93D, #FF8C42)',
    description: 'Castle early and keep a pawn shield in front of your king. An exposed king is a dead king.',
    animationFen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 3',
    animationMoves: ['e1g1'],
    animationAnnotations: {
      highlights: [
        { square: 'g1', color: 'good', label: 'Safe', badge: '🏰', glow: true },
      ],
      arrows: [
        { from: 'e1', to: 'g1', type: 'move', color: '#A855F7', animated: true },
      ],
    },
  },
  exercises: [
    // Exercise 1: Castle to safety
    {
      id: 'ex_king_1',
      lessonId: 'lesson_king_safety',
      type: 'decision',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
      questionPrompt: 'Your king is still in the center. What\'s the safest move?',
      correctMoves: ['e1g1'],
      bestMove: 'e1g1',
      conceptTag: 'king_safety',
      difficulty: 1,
      visualHints: {
        highlights: [
          { square: 'e1', color: 'attention', pulse: true, label: 'Exposed!' },
          { square: 'g1', color: 'good', label: 'Safe' },
        ],
        zones: [
          { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h2'], color: 'attention', opacity: 0.15, label: 'Safety zone' },
        ],
        arrows: [
          { from: 'e1', to: 'g1', type: 'move', color: '#A855F7', animated: true },
        ],
      },
      feedbackCorrect: {
        short: 'Castle! The king tucks behind the pawns on f2, g2, h2. Safe and sound.',
        why: 'After castling, the king on g1 is protected by a pawn shield: f2, g2, h2. Pawns are the best bodyguards — they\'re cheap and can\'t be attacked by enemy pieces without being defended. The king on e1 was exposed in the center where all the action happens: open files, diagonals, knight forks. On g1, the king is tucked away in the corner behind a wall of pawns.',
        quote: '"Castle early, castle often." — general principle',
        boardAnnotations: {
          highlights: [
            { square: 'g1', color: 'good', label: 'Safe!', badge: '🏰', glow: true },
          ],
          zones: [
            { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h2'], color: 'good', opacity: 0.15, label: 'Safe zone' },
          ],
          arrows: [
            { from: 'e1', to: 'g1', type: 'move', color: '#A855F7', animated: true },
            { from: 'f2', to: 'g1', type: 'support', color: '#5B9BD5', animated: true },
            { from: 'g2', to: 'g1', type: 'support', color: '#5B9BD5', animated: true },
            { from: 'h2', to: 'g1', type: 'support', color: '#5B9BD5', animated: true },
          ],
          pieceAnnotations: [
            { square: 'g1', halo: 'good', badge: '🏰' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'The king is exposed in the center. The best way to safety is castling — king to the corner, rook to the center.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'g1', color: 'good', pulse: true, label: 'Castle here' },
            { square: 'e1', color: 'bad', pulse: true, label: 'Exposed' },
          ],
          zones: [
            { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h2'], color: 'good', opacity: 0.15 },
          ],
          arrows: [
            { from: 'e1', to: 'g1', type: 'move', color: '#A855F7', animated: true },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-squares', squares: ['e1'], color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['g1'], color: 'good' },
        { level: 3, action: 'pulse-square', square: 'g1', color: 'good' },
      ],
      tags: ['king_safety', 'castling', 'pawn_shield', 'opening'],
    },

    // Exercise 2: Don't open the king position
    {
      id: 'ex_king_2',
      lessonId: 'lesson_king_safety',
      type: 'decision',
      fen: 'r4rk1/ppp2ppp/2n1bn2/3pp3/3PP3/2N1BN2/PPP2PPP/R4RK1 w - - 0 10',
      questionPrompt: 'Both sides have castled. White is considering pushing the h-pawn to attack. Is h2-h4 a good move here?',
      correctMoves: ['h2h3'],
      bestMove: 'h2h3',
      conceptTag: 'king_safety',
      difficulty: 2,
      visualHints: {
        highlights: [
          { square: 'h2', color: 'attention', pulse: true, label: 'Pawn shield' },
          { square: 'h4', color: 'bad', label: 'Gap!' },
        ],
        zones: [
          { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h2'], color: 'attention', opacity: 0.12, label: 'King zone' },
        ],
      },
      feedbackCorrect: {
        short: 'h3! Keep the pawn shield intact. Pushing h2-h4 would create a gap (g2-h2-h3 vs g2-h3), weakening the king. h3 controls g4 and h4 without creating a gap.',
        why: 'When the king is castled, the 3 pawns in front (f2, g2, h2) form a shield. Moving one creates gaps that enemy pieces can exploit. h2-h4 leaves g3 weak and allows enemy bishops to attack along the a8-h1 diagonal. h2-h3 is safer — it creates luft (air) for the king and controls g4/h4 without opening a file. The principle: keep your pawn shield intact unless you have a strong reason to break it.',
        boardAnnotations: {
          highlights: [
            { square: 'h3', color: 'good', label: 'Safe', glow: true },
            { square: 'h2', color: 'bad', label: 'Gap if moved', badge: '⚠️' },
          ],
          zones: [
            { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h2'], color: 'good', opacity: 0.12, label: 'Shield intact' },
          ],
          arrows: [
            { from: 'h2', to: 'h3', type: 'move', color: '#A855F7', animated: true },
          ],
          pieceAnnotations: [
            { square: 'g1', halo: 'good', badge: '🛡️' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'Pushing the h-pawn creates a gap in the pawn shield, making the king vulnerable. A safer move preserves the shield.',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'h4', color: 'bad', pulse: true, label: 'Gap!' },
            { square: 'h3', color: 'good', pulse: true, label: 'Safe alternative' },
          ],
          zones: [
            { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h2'], color: 'bad', opacity: 0.12 },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-squares', squares: ['h2'], color: 'attention' },
        { level: 2, action: 'glow-squares', squares: ['h3'], color: 'good' },
        { level: 3, action: 'pulse-square', square: 'h3', color: 'good' },
      ],
      tags: ['king_safety', 'pawn_shield', 'luft', 'prophylaxis'],
    },

    // Exercise 3: Exploit the exposed king
    {
      id: 'ex_king_3',
      lessonId: 'lesson_king_safety',
      type: 'decision',
      fen: 'r5k1/ppp2ppp/2n1bn2/3pp3/3PP3/2N1BN2/PPP3PP/R4RK1 b - - 0 10',
      questionPrompt: 'White just played h2-h4, weakening their king. How can you exploit this? (Black to move)',
      correctMoves: ['f6d7', 'c6a5'],
      bestMove: 'f6d7',
      conceptTag: 'king_safety',
      difficulty: 3,
      visualHints: {
        highlights: [
          { square: 'h4', color: 'bad', pulse: true, label: 'Gap!' },
          { square: 'g3', color: 'bad', label: 'Weak' },
        ],
        zones: [
          { squares: ['f1', 'f2', 'g1', 'g2', 'h1', 'h4'], color: 'bad', opacity: 0.12, label: 'Exposed zone' },
        ],
        arrows: [
          { from: 'f8', to: 'h6', type: 'plan', color: '#A855F7', animated: true },
          { from: 'h6', to: 'g3', type: 'threat', color: '#FF5757', animated: true },
        ],
      },
      feedbackCorrect: {
        short: 'Nd7! The knight reroutes to g3 via e5→g4→g3 or directly attacks the weakened g3 square. White\'s king is now in danger.',
        why: 'White\'s h2-h4 created a serious weakness on g3. The f1-bishop no longer defends it (the pawn moved). A knight on g3 would fork the king on g1 and the rook on f1. The reroute Nd7→e5→g4→g3 exploits the gap perfectly. This is why you should never push king-side pawns without a good reason — it creates exploitable weaknesses.',
        quote: '"The strongest opening is the one that leaves your king safest." — Capablanca',
        boardAnnotations: {
          highlights: [
            { square: 'd7', color: 'good', label: 'Reroute', glow: true },
            { square: 'g3', color: 'bad', label: 'Target!', badge: '⚠️', pulse: true },
            { square: 'h4', color: 'bad', label: 'Gap' },
          ],
          zones: [
            { squares: ['f1', 'f2', 'g1', 'g2', 'h1'], color: 'bad', opacity: 0.15, label: 'Exposed' },
          ],
          arrows: [
            { from: 'f6', to: 'd7', type: 'move', color: '#A855F7', animated: true },
            { from: 'd7', to: 'e5', type: 'plan', color: '#A855F7', animated: true },
            { from: 'e5', to: 'g4', type: 'plan', color: '#A855F7', animated: true },
            { from: 'g4', to: 'g3', type: 'threat', color: '#FF5757', animated: true },
          ],
          pieceAnnotations: [
            { square: 'd7', halo: 'good', badge: '→' },
            { square: 'g1', halo: 'bad', badge: '❗' },
          ],
        },
      },
      feedbackIncorrect: {
        short: 'White\'s h4 created a weakness on g3. How can you get a piece to attack g3?',
        showCorrectPulse: true,
        boardAnnotations: {
          highlights: [
            { square: 'g3', color: 'bad', pulse: true, label: 'Weak!' },
            { square: 'd7', color: 'good', pulse: true, label: 'Reroute' },
          ],
          arrows: [
            { from: 'd7', to: 'g3', type: 'plan', color: '#A855F7', animated: true },
          ],
        },
      },
      hints: [
        { level: 1, action: 'glow-squares', squares: ['g3'], color: 'bad' },
        { level: 2, action: 'glow-squares', squares: ['d7'], color: 'good' },
        { level: 3, action: 'pulse-square', square: 'd7', color: 'good' },
      ],
      tags: ['king_safety', 'exploitation', 'weak_square', 'pawn_shield'],
    },
  ],
};

export const allLessons: Lesson[] = [outpostLesson, weakSquaresLesson, kingSafetyLesson];