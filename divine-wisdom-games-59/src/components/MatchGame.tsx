import { useState, useEffect, useRef } from "react";
import { useMatchPairs } from "@/hooks/useSheetData";
import { RefreshCw, Loader2, Target } from "lucide-react";

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

interface ArrowAnim {
  id: number;
  correct: boolean;
  active: boolean;
}

export const MatchGame = () => {
  const { pairs, loading, error } = useMatchPairs();
  const [gamePairs, setGamePairs] = useState<{ left: string; right: string }[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedLeft, setMatchedLeft] = useState<Record<number, "correct" | "wrong">>({});
  const [matchedRight, setMatchedRight] = useState<Record<number, "correct" | "wrong">>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [arrows, setArrows] = useState<ArrowAnim[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(false);
  const arrowIdRef = useRef(0);

  const initGame = () => {
    if (pairs.length === 0) return;
    const selected = shuffle(pairs).slice(0, 4);
    setGamePairs(selected.map((p) => ({ left: p.left_item, right: p.right_item })));
    setRightItems(shuffle(selected.map((p) => p.right_item)));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedLeft({});
    setMatchedRight({});
    setScore(0);
    setAttempts(0);
    setArrows([]);
    setGameOver(false);
  };

  useEffect(() => {
    if (pairs.length > 0) initGame();
  }, [pairs]);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const leftAnswer = gamePairs[selectedLeft].right;
      const rightAnswer = rightItems[selectedRight];
      const isCorrect = leftAnswer.trim().toLowerCase() === rightAnswer.trim().toLowerCase();

      // Fire arrow animation
      const arrowId = ++arrowIdRef.current;
      setArrows((prev) => [...prev, { id: arrowId, correct: isCorrect, active: true }]);
      setTimeout(() => {
        setArrows((prev) => prev.filter((a) => a.id !== arrowId));
      }, 1000);

      // Update matches
      setMatchedLeft((prev) => ({ ...prev, [selectedLeft]: isCorrect ? "correct" : "wrong" }));
      setMatchedRight((prev) => ({ ...prev, [selectedRight]: isCorrect ? "correct" : "wrong" }));

      if (isCorrect) {
        setScore((s) => {
          setScoreAnim(true);
          setTimeout(() => setScoreAnim(false), 500);
          return s + 1;
        });
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        if (newAttempts >= 4) {
          setTimeout(() => setGameOver(true), 500);
        }
      }, 900);
    }
  }, [selectedLeft, selectedRight]);

  const getLeftClass = (i: number) => {
    if (matchedLeft[i] === "correct") return "match-item matched-correct";
    if (matchedLeft[i] === "wrong") return "match-item matched-wrong";
    if (selectedLeft === i) return "match-item selected";
    return "match-item";
  };

  const getRightClass = (i: number) => {
    if (matchedRight[i] === "correct") return "match-item matched-correct";
    if (matchedRight[i] === "wrong") return "match-item matched-wrong";
    if (selectedRight === i) return "match-item selected";
    return "match-item";
  };

  const handleLeftClick = (i: number) => {
    if (matchedLeft[i] || selectedLeft === i) return;
    setSelectedLeft(i);
  };

  const handleRightClick = (i: number) => {
    if (matchedRight[i] || selectedLeft === null) return;
    setSelectedRight(i);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-muted-foreground font-crimson text-lg">जोड़े ढूंढे जा रहे हैं...</p>
      </div>
    );
  }

  if (error || pairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-saffron font-crimson text-lg">{error || "No pairs found in the sheet."}</p>
        <p className="text-muted-foreground text-sm">Please ensure the Google Sheet is publicly accessible.</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
        <Target
          className="w-16 h-16 text-gold animate-pulse-glow"
          style={{ filter: "drop-shadow(0 0 15px hsl(42 95% 52% / 0.7))" }}
        />
        <h3 className="font-cinzel text-2xl text-gold">तीर चलाने का परिणाम</h3>
        <div
          className="text-6xl font-cinzel font-bold rounded-full w-28 h-28 flex items-center justify-center border-2 border-gold"
          style={{ color: "hsl(42 95% 52%)", boxShadow: "0 0 40px hsl(42 95% 52% / 0.5)" }}
        >
          {score}/4
        </div>
        <p className="font-devanagari text-sacred text-lg">
          {score === 4
            ? "परफेक्ट! आपने सभी जोड़े सही मिलाए! 🏹✨"
            : score >= 3
            ? "उत्तम! आपकी निशानेबाजी कुशल है।"
            : "अभ्यास से निपुणता आती है। पुनः प्रयास करें।"}
        </p>
        <button
          onClick={initGame}
          className="btn-divine px-8 py-3 flex items-center gap-2 text-midnight font-cinzel font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          पुनः खेलें
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground font-crimson">
          <span>बाईं ओर से चुनें → दाईं ओर से मिलाएं</span>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-card ${scoreAnim ? "animate-score-pop" : ""}`}
          style={{ boxShadow: "0 0 15px hsl(42 95% 52% / 0.2)" }}
        >
          <Target className="w-4 h-4 text-gold" />
          <span className="font-cinzel font-bold text-gold">{score}/4</span>
        </div>
      </div>

      {/* Arrow animation overlay */}
      {arrows.map((arrow) => (
        <div
          key={arrow.id}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <div
            className="relative flex items-center"
            style={{
              animation: "arrow-fly 0.9s ease-out forwards",
              "--arrow-travel": "300px",
            } as React.CSSProperties}
          >
            {/* Arrow body */}
            <div
              className="h-0.5 w-32 sm:w-48"
              style={{
                background: arrow.correct
                  ? "linear-gradient(to right, hsl(42 95% 52%), hsl(120 70% 50%))"
                  : "linear-gradient(to right, hsl(25 90% 52%), hsl(0 70% 50%))",
                boxShadow: arrow.correct
                  ? "0 0 15px hsl(42 95% 52% / 0.9), 0 0 30px hsl(120 70% 50% / 0.6)"
                  : "0 0 10px hsl(0 70% 50% / 0.6)",
              }}
            />
            {/* Arrowhead */}
            <div
              className="w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: `10px solid ${arrow.correct ? "hsl(120 70% 50%)" : "hsl(0 70% 50%)"}`,
              }}
            />
          </div>
        </div>
      ))}

      {/* Match columns */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <p className="font-cinzel text-xs text-muted-foreground text-center mb-1 uppercase tracking-widest">प्रश्न</p>
          {gamePairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => handleLeftClick(i)}
              disabled={!!matchedLeft[i]}
              className={getLeftClass(i)}
            >
              {pair.left}
            </button>
          ))}
        </div>

        {/* Center: bow indicator */}
        <div className="flex flex-col items-center gap-3 pt-8">
          {gamePairs.map((_, i) => (
            <div
              key={i}
              className="w-8 h-10 flex items-center justify-center"
            >
              <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
                <path
                  d="M12 2 C4 12, 4 28, 12 38"
                  stroke={matchedLeft[i] === "correct" ? "hsl(120 70% 50%)" : matchedLeft[i] === "wrong" ? "hsl(0 70% 50%)" : "hsl(42 40% 35%)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <line
                  x1="12" y1="2" x2="12" y2="38"
                  stroke={selectedLeft === i ? "hsl(42 95% 52%)" : "hsl(42 40% 25%)"}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          <p className="font-cinzel text-xs text-muted-foreground text-center mb-1 uppercase tracking-widest">उत्तर</p>
          {rightItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleRightClick(i)}
              disabled={!!matchedRight[i] || selectedLeft === null}
              className={getRightClass(i)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {selectedLeft !== null && (
        <p className="text-center text-muted-foreground font-devanagari text-sm animate-text-reveal">
          अब दाईं ओर से उत्तर चुनें...
        </p>
      )}
    </div>
  );
};
