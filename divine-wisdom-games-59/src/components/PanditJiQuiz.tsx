import { useState, useEffect, useCallback } from "react";
import panditJiImg from "@/assets/pandit-ji.png";
import { useQuizQuestions } from "@/hooks/useSheetData";
import { Star, RefreshCw, Loader2 } from "lucide-react";

const TOTAL_QUESTIONS = 10;

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

type OptionKey = "option_a" | "option_b" | "option_c" | "option_d";

const OPTIONS: OptionKey[] = ["option_a", "option_b", "option_c", "option_d"];
const OPTION_LABELS = ["A", "B", "C", "D"];

export const PanditJiQuiz = () => {
  const { questions, loading, error } = useQuizQuestions();
  const [queue, setQueue] = useState<typeof questions>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(false);

  const initGame = useCallback(() => {
    if (questions.length === 0) return;
    setQueue(shuffle(questions).slice(0, TOTAL_QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setGameOver(false);
    setChatVisible(false);
    setTimeout(() => setChatVisible(true), 300);
  }, [questions]);

  useEffect(() => {
    if (questions.length > 0) initGame();
  }, [questions]);

  const currentQ = queue[current];

  // Check if correct field is an option letter (a/b/c/d) or the full answer text
  const isCorrectOption = (optKey: OptionKey): boolean => {
    const correct = currentQ.correct.toLowerCase().trim();
    const optLetter = optKey.replace("option_", ""); // "a", "b", "c", "d"
    // Match by letter key
    if (correct === optLetter) return true;
    // Match by full text
    const answer = currentQ[optKey];
    if (answer.toLowerCase().trim() === correct) return true;
    return false;
  };

  const handleSelect = (optKey: OptionKey) => {
    if (answered) return;
    const isCorrect = isCorrectOption(optKey);
    setSelected(optKey);
    setAnswered(true);

    if (isCorrect) {
      setAnimClass("glow-correct");
      setScore((s) => {
        const newScore = s + 1;
        setScoreAnim(true);
        setTimeout(() => setScoreAnim(false), 500);
        return newScore;
      });
    } else {
      setAnimClass("shake-wrong");
    }
    setTimeout(() => setAnimClass(""), 800);
  };

  const handleNext = () => {
    if (current + 1 >= TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setChatVisible(false);
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnswered(false);
        setChatVisible(true);
      }, 300);
    }
  };

  const getOptionClass = (optKey: OptionKey) => {
    if (!answered) return "option-btn";
    const isCorrect = isCorrectOption(optKey);
    if (isCorrect) return `option-btn correct ${animClass === "glow-correct" && selected === optKey ? "glow-correct" : ""}`;
    if (selected === optKey && !isCorrect) return `option-btn wrong ${animClass}`;
    return "option-btn opacity-60";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-muted-foreground font-crimson text-lg">पंडित जी प्रश्न ला रहे हैं...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-saffron font-crimson text-lg">{error || "No questions found in the sheet."}</p>
        <p className="text-muted-foreground text-sm">Please ensure the Google Sheet is publicly accessible.</p>
      </div>
    );
  }

  if (gameOver) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const getMessage = () => {
      if (percentage >= 80) return "अत्युत्तम! आपकी आध्यात्मिक ज्ञान श्रेष्ठ है! 🙏";
      if (percentage >= 50) return "साधु! आप आध्यात्मिक पथ पर अग्रसर हैं।";
      return "अभ्यास करते रहें। ज्ञान का मार्ग अनंत है।";
    };

    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-8 h-8 ${i < Math.round(score / 2) ? "text-gold fill-gold" : "text-muted"}`}
            />
          ))}
        </div>
        <h3 className="font-cinzel text-2xl text-gold">आपका आध्यात्मिक ज्ञान स्कोर</h3>
        <div
          className="text-6xl font-cinzel font-bold animate-pulse-glow rounded-full w-28 h-28 flex items-center justify-center border-2 border-gold"
          style={{ color: "hsl(42 95% 52%)", boxShadow: "0 0 40px hsl(42 95% 52% / 0.5)" }}
        >
          {score}/{TOTAL_QUESTIONS}
        </div>
        <p className="font-devanagari text-sacred text-lg max-w-xs">{getMessage()}</p>
        <button
          onClick={initGame}
          className="btn-divine px-8 py-3 flex items-center gap-2 text-midnight font-cinzel font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          पुनः आरंभ करें
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Score + Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-crimson">प्रश्न</span>
          <span className="text-gold font-cinzel font-bold">{current + 1}</span>
          <span className="text-muted-foreground font-crimson">/ {TOTAL_QUESTIONS}</span>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-card ${scoreAnim ? "animate-score-pop" : ""}`}
          style={{ boxShadow: "0 0 15px hsl(42 95% 52% / 0.2)" }}
        >
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="font-cinzel font-bold text-gold">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((current) / TOTAL_QUESTIONS) * 100}%`,
            background: "linear-gradient(to right, hsl(42 95% 52%), hsl(25 90% 52%))",
          }}
        />
      </div>

      {/* Pandit Ji + Chat Bubble */}
      <div className="flex items-end gap-4">
        {/* Pandit Ji */}
        <div className="relative flex-shrink-0 animate-gentle-bow">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-40"
            style={{ background: "radial-gradient(circle, hsl(42 95% 52% / 0.6), transparent 70%)" }}
          />
          <img
            src={panditJiImg}
            alt="Pandit Ji"
            className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 0 20px hsl(42 95% 52% / 0.5))" }}
          />
        </div>

        {/* Chat Bubble */}
        {currentQ && (
          <div
            className={`relative flex-1 game-card p-4 sm:p-5 transition-all duration-300 ${chatVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* Chat bubble tail */}
            <div
              className="absolute left-[-10px] bottom-6 w-0 h-0"
              style={{
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderRight: "10px solid hsl(228 30% 13%)",
              }}
            />
            <p className="font-devanagari text-sm text-muted-foreground mb-1">पंडित जी पूछते हैं:</p>
            <p className="font-crimson text-lg sm:text-xl text-sacred leading-relaxed">{currentQ.question}</p>
          </div>
        )}
      </div>

      {/* Options */}
      {currentQ && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {OPTIONS.map((optKey, i) => (
            <button
              key={optKey}
              onClick={() => handleSelect(optKey)}
              disabled={answered}
              className={getOptionClass(optKey)}
            >
              <span className="font-cinzel text-gold mr-2 text-sm">{OPTION_LABELS[i]}.</span>
              {currentQ[optKey]}
            </button>
          ))}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div className="flex justify-end mt-2">
          <button
            onClick={handleNext}
            className="btn-divine px-6 py-2.5 text-midnight font-cinzel font-semibold text-sm animate-text-reveal"
          >
            {current + 1 >= TOTAL_QUESTIONS ? "परिणाम देखें →" : "अगला प्रश्न →"}
          </button>
        </div>
      )}
    </div>
  );
};
