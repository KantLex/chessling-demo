import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { COLOR_MAP, ARROW_COLOR_MAP, type BoardAnnotations, type HighlightColor, type ArrowType } from './types';

// ─── Helpers ──────────────────────────────────────────────

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

function squareToCoords(square: string): { row: number; col: number } {
  const file = square.charCodeAt(0) - 97; // 'a' = 0
  const rank = parseInt(square[1]);
  return { row: 8 - rank, col: file };
}

function coordsToSquare(row: number, col: number): string {
  return FILES[col] + (8 - row);
}

function isLightSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 0;
}

// ─── Piece rendering ───────────────────────────────────────

const PIECE_UNICODE: Record<string, string> = {
  'wp': '♙', 'wn': '♘', 'wb': '♗', 'wr': '♖', 'wq': '♕', 'wk': '♔',
  'bp': '♟', 'bn': '♞', 'bb': '♝', 'br': '♜', 'bq': '♛', 'bk': '♚',
};

function PieceSymbol({ piece, color, isDragging }: { piece: string; color: 'w' | 'b'; isDragging?: boolean }) {
  const key = color + piece;
  const symbol = PIECE_UNICODE[key];
  return (
    <span
      style={{
        fontSize: 'min(7vw, 42px)',
        lineHeight: 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        color: color === 'w' ? '#FFFFFF' : '#1A1A2E',
        textShadow: color === 'w'
          ? '0 1px 3px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)'
          : '0 1px 3px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.2)',
        transition: 'transform 0.15s ease-out',
        transform: isDragging ? 'scale(1.15)' : 'scale(1)',
        display: 'inline-block',
      }}
    >
      {symbol}
    </span>
  );
}

// ─── Arrow rendering ───────────────────────────────────────

function ArrowLayer({ arrows, boardSize }: { arrows: Arrow[] | undefined; boardSize: number }) {
  if (!arrows || arrows.length === 0) return null;
  
  const cellSize = boardSize / 8;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: boardSize,
        height: boardSize,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {arrows.map((arrow, i) => {
        const from = squareToCoords(arrow.from);
        const to = squareToCoords(arrow.to);
        const x1 = from.col * cellSize + cellSize / 2;
        const y1 = from.row * cellSize + cellSize / 2;
        const x2 = to.col * cellSize + cellSize / 2;
        const y2 = to.row * cellSize + cellSize / 2;
        
        // Shorten arrow so it doesn't go under the piece
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const shorten = cellSize * 0.35;
        const ratio = (len - shorten) / len;
        const endX = x1 + dx * ratio;
        const endY = y1 + dy * ratio;
        
        const color = arrow.color || ARROW_COLOR_MAP[arrow.type];
        const isDashed = arrow.type === 'influence' || arrow.type === 'support';
        const isAnimated = arrow.animated !== false;
        
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={endX}
              y2={endY}
              stroke={color}
              strokeWidth={cellSize * 0.08}
              strokeLinecap="round"
              strokeDasharray={isDashed ? `${cellSize * 0.15}, ${cellSize * 0.1}` : undefined}
              opacity={0.7}
              style={isAnimated ? {
                animation: `drawArrow 0.4s ease-out forwards`,
                strokeDasharray: isDashed ? `${cellSize * 0.15}, ${cellSize * 0.1}` : '100',
              } : undefined}
            />
            <polygon
              points={`${endX},${endY} ${endX - cellSize * 0.12 * Math.cos(Math.atan2(dy, dx) - 0.5)},${endY - cellSize * 0.12 * Math.sin(Math.atan2(dy, dx) - 0.5)} ${endX - cellSize * 0.12 * Math.cos(Math.atan2(dy, dx) + 0.5)},${endY - cellSize * 0.12 * Math.sin(Math.atan2(dy, dx) + 0.5)}`}
              fill={color}
              opacity={0.8}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main Chessboard Component ─────────────────────────────

interface ChessboardProps {
  fen: string;
  annotations?: BoardAnnotations;
  onMove?: (from: string, to: string) => void;
  interactive?: boolean;
  showCoordinates?: boolean;
  lastMove?: { from: string; to: string } | null;
  className?: string;
}

export function Chessboard({
  fen,
  annotations,
  onMove,
  interactive = false,
  showCoordinates = true,
  lastMove = null,
  className = '',
}: ChessboardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(400);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  
  const chess = useMemo(() => new Chess(fen), [fen]);
  
  // Responsive board sizing
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        const parent = boardRef.current.parentElement;
        if (parent) {
          const maxSize = Math.min(parent.clientWidth - 16, 480);
          setBoardSize(maxSize);
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Build board state from FEN
  const board = useMemo(() => {
    const b: (string | null)[][] = [];
    const rows = fen.split(' ')[0].split('/');
    for (let r = 0; r < 8; r++) {
      const row: (string | null)[] = [];
      let col = 0;
      let strIdx = 0;
      while (col < 8 && strIdx < rows[r].length) {
        const ch = rows[r][strIdx];
        if (ch >= '1' && ch <= '8') {
          for (let i = 0; i < parseInt(ch); i++) row.push(null);
          col += parseInt(ch);
        } else {
          row.push(ch);
          col++;
        }
        strIdx++;
      }
      // Pad if needed
      while (row.length < 8) row.push(null);
      b.push(row);
    }
    return b;
  }, [fen]);
  
  // Get legal moves for selected piece
  const legalMoves = useMemo(() => {
    if (!selectedSquare) return [];
    const moves = chess.moves({ square: selectedSquare as any, verbose: true });
    return moves.map(m => m.to);
  }, [selectedSquare, chess]);
  
  // Build annotation lookups
  const highlightMap = useMemo(() => {
    const m = new Map<string, { color: HighlightColor; label?: string; badge?: string; pulse?: boolean; glow?: boolean }>();
    annotations?.highlights?.forEach(h => {
      m.set(h.square, { color: h.color, label: h.label, badge: h.badge, pulse: h.pulse, glow: h.glow });
    });
    return m;
  }, [annotations]);
  
  const pieceAnnotationMap = useMemo(() => {
    const m = new Map<string, { halo?: HighlightColor; badge?: string; desaturate?: boolean; wobble?: boolean }>();
    annotations?.pieceAnnotations?.forEach(p => {
      m.set(p.square, { halo: p.halo, badge: p.badge, desaturate: p.desaturate, wobble: p.wobble });
    });
    return m;
  }, [annotations]);
  
  const zoneSquares = useMemo(() => {
    const m = new Map<string, { color: HighlightColor; opacity: number }>();
    annotations?.zones?.forEach(z => {
      z.squares.forEach(s => m.set(s, { color: z.color, opacity: z.opacity ?? 0.2 }));
    });
    return m;
  }, [annotations]);
  
  const handleSquareClick = useCallback((square: string) => {
    if (!interactive) return;
    
    const piece = board[squareToCoords(square).row]?.[squareToCoords(square).col];
    const isOwnPiece = piece && piece === piece.toUpperCase(); // uppercase = white
    
    if (selectedSquare === null) {
      // Select a piece
      if (isOwnPiece) {
        setSelectedSquare(square);
      }
    } else if (square === selectedSquare) {
      // Deselect
      setSelectedSquare(null);
    } else if (isOwnPiece) {
      // Select different piece
      setSelectedSquare(square);
    } else {
      // Try to move
      if (legalMoves.includes(square)) {
        onMove?.(selectedSquare, square);
      }
      setSelectedSquare(null);
    }
  }, [interactive, board, selectedSquare, legalMoves, onMove]);
  
  const handleDragStart = (e: React.DragEvent, square: string) => {
    if (!interactive) return;
    const piece = board[squareToCoords(square).row]?.[squareToCoords(square).col];
    if (piece && piece === piece.toUpperCase()) {
      setDraggedPiece(square);
      setSelectedSquare(square);
      e.dataTransfer.effectAllowed = 'move';
      // Create a transparent drag image
      const img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(img, 0, 0);
    }
  };
  
  const handleDrop = (e: React.DragEvent, square: string) => {
    e.preventDefault();
    if (!interactive || !draggedPiece) return;
    if (legalMoves.includes(square)) {
      onMove?.(draggedPiece, square);
    }
    setSelectedSquare(null);
    setDraggedPiece(null);
  };
  
  const cellSize = boardSize / 8;
  
  return (
    <div
      ref={boardRef}
      className={className}
      style={{
        position: 'relative',
        width: boardSize,
        height: boardSize,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Board squares */}
      {RANKS.map((_, row) =>
        FILES.map((_, col) => {
          const square = coordsToSquare(row, col);
          const light = isLightSquare(row, col);
          const piece = board[row]?.[col];
          const highlight = highlightMap.get(square);
          const pieceAnno = pieceAnnotationMap.get(square);
          const zone = zoneSquares.get(square);
          const isSelected = selectedSquare === square;
          const isLegalMove = legalMoves.includes(square);
          const isLastMove = lastMove?.from === square || lastMove?.to === square;
          const isDraggedOver = draggedPiece && square !== draggedPiece;
          
          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              onDragOver={(e) => { if (interactive) e.preventDefault(); }}
              onDrop={(e) => handleDrop(e, square)}
              style={{
                position: 'absolute',
                left: col * cellSize,
                top: row * cellSize,
                width: cellSize,
                height: cellSize,
                background: light ? '#E8D5B7' : '#2B2B42',
                cursor: interactive && piece ? 'pointer' : 'default',
                transition: 'background 0.2s',
              }}
            >
              {/* Zone overlay */}
              {zone && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: COLOR_MAP[zone.color],
                  opacity: zone.opacity,
                }} />
              )}
              
              {/* Last move highlight */}
              {isLastMove && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255, 217, 61, 0.25)',
                }} />
              )}
              
              {/* Annotation highlight */}
              {highlight && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: COLOR_MAP[highlight.color],
                  opacity: highlight.pulse ? 0.5 : 0.35,
                  animation: highlight.pulse ? 'pulse 1.5s ease-in-out infinite' : undefined,
                  boxShadow: highlight.glow ? `inset 0 0 ${cellSize * 0.15}px ${COLOR_MAP[highlight.color]}` : undefined,
                }} />
              )}
              
              {/* Selected square */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.6)',
                }} />
              )}
              
              {/* Legal move indicator */}
              {isLegalMove && !piece && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: cellSize * 0.3,
                  height: cellSize * 0.3,
                  marginTop: -cellSize * 0.15,
                  marginLeft: -cellSize * 0.15,
                  borderRadius: '50%',
                  background: 'rgba(0, 217, 163, 0.5)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              )}
              
              {/* Legal capture indicator */}
              {isLegalMove && piece && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  boxShadow: 'inset 0 0 0 3px rgba(255, 87, 87, 0.6)',
                }} />
              )}
              
              {/* Piece */}
              {piece && (
                <div
                  draggable={interactive && piece === piece.toUpperCase()}
                  onDragStart={(e) => handleDragStart(e, square)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: draggedPiece === square ? 0.3 : 1,
                    filter: pieceAnno?.desaturate ? 'grayscale(0.6)' : undefined,
                  }}
                >
                  {/* Halo glow */}
                  {pieceAnno?.halo && (
                    <div style={{
                      position: 'absolute',
                      inset: cellSize * 0.1,
                      borderRadius: '50%',
                      background: `${COLOR_MAP[pieceAnno.halo]}33`,
                      boxShadow: `0 0 ${cellSize * 0.15}px ${COLOR_MAP[pieceAnno.halo]}`,
                      animation: 'glowPulse 2s ease-in-out infinite',
                    }} />
                  )}
                  <PieceSymbol
                    piece={piece.toLowerCase()}
                    color={piece === piece.toUpperCase() ? 'w' : 'b'}
                    isDragging={draggedPiece === square}
                  />
                </div>
              )}
              
              {/* Badge (emoji above piece) */}
              {pieceAnno?.badge && (
                <div style={{
                  position: 'absolute',
                  top: 1,
                  right: 1,
                  fontSize: cellSize * 0.28,
                  lineHeight: 1,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                  zIndex: 5,
                }}>
                  {pieceAnno.badge}
                </div>
              )}
              
              {/* Highlight label */}
              {highlight?.label && (
                <div style={{
                  position: 'absolute',
                  bottom: 1,
                  left: 1,
                  fontSize: cellSize * 0.18,
                  fontWeight: 600,
                  color: '#FFF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                  zIndex: 5,
                  maxWidth: cellSize - 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {highlight.label}
                </div>
              )}
              
              {/* Highlight badge */}
              {highlight?.badge && !pieceAnno?.badge && (
                <div style={{
                  position: 'absolute',
                  top: 1,
                  right: 1,
                  fontSize: cellSize * 0.28,
                  lineHeight: 1,
                  zIndex: 5,
                }}>
                  {highlight.badge}
                </div>
              )}
              
              {/* Coordinates */}
              {showCoordinates && col === 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  fontSize: cellSize * 0.18,
                  fontWeight: 600,
                  color: light ? '#8B7355' : '#C0B090',
                  zIndex: 1,
                }}>
                  {8 - row}
                </span>
              )}
              {showCoordinates && row === 7 && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 2,
                  fontSize: cellSize * 0.18,
                  fontWeight: 600,
                  color: light ? '#8B7355' : '#C0B090',
                  zIndex: 1,
                }}>
                  {FILES[col]}
                </span>
              )}
            </div>
          );
        })
      )}
      
      {/* Arrow layer */}
      <ArrowLayer arrows={annotations?.arrows} boardSize={boardSize} />
    </div>
  );
}