import { useState } from "react";
import { ParticleSystem } from "@/components/ParticleSystem";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PanditJiQuiz } from "@/components/PanditJiQuiz";
import { MatchGame } from "@/components/MatchGame";
import divineBg from "@/assets/divine-bg.jpg";

const OmSymbol = () => (
  <span
    className="font-devanagari text-gold"
    style={{ textShadow: "0 0 20px hsl(42 95% 52% / 0.8)" }}
  >
    ॐ
  </span>
);

const SectionDivider = () => (
  <div className="flex items-center gap-4 my-2">
    <div className="divider-sacred flex-1" />
    <OmSymbol />
    <div className="divider-sacred flex-1" />
  </div>
);

const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-5 h-5 text-gold animate-bell"
    style={{ transformOrigin: "50% 0%" }}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <line x1="12" y1="2" x2="12" y2="4" />
  </svg>
);

type Tab = "quiz" | "match";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("quiz");

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Particle System */}
      <ParticleSystem />

      {/* Audio Player */}
      <AudioPlayer />

      {/* Hero Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={divineBg}
          alt="Divine Background"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35) saturate(1.2)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, hsl(230 35% 5% / 0.6) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-8 sm:py-10 px-4">
          {/* Site name */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <BellIcon />
            <p className="font-cinzel text-sm sm:text-base tracking-[0.3em] text-muted-foreground uppercase">
              Naman Darshan
            </p>
            <BellIcon />
          </div>

          {/* Section title */}
          <h1
            className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold mb-3"
            style={{
              background: "linear-gradient(135deg, hsl(48 100% 72%) 0%, hsl(42 95% 52%) 40%, hsl(25 90% 52%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px hsl(42 95% 52% / 0.4))",
            }}
          >
            Naman Khel
          </h1>

          {/* Mantra */}
          <p
            className="font-devanagari text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ।
          </p>
          <p className="font-devanagari text-xs text-muted-foreground/60 mt-1">
            मृत्योर्मा अमृतं गमय । ॐ शान्तिः शान्तिः शान्तिः ॥
          </p>

          <SectionDivider />
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-16 max-w-3xl mx-auto w-full">
          {/* Game Tabs */}
          <div className="flex rounded-lg p-1 mb-8 border border-gold/20 bg-card/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex-1 py-3 px-4 rounded-md font-cinzel text-sm sm:text-base transition-all duration-300 ${
                activeTab === "quiz"
                  ? "btn-divine text-midnight shadow-lg"
                  : "text-muted-foreground hover:text-sacred"
              }`}
            >
              🧘 पंडित जी प्रश्नोत्तरी
            </button>
            <button
              onClick={() => setActiveTab("match")}
              className={`flex-1 py-3 px-4 rounded-md font-cinzel text-sm sm:text-base transition-all duration-300 ${
                activeTab === "match"
                  ? "btn-divine text-midnight shadow-lg"
                  : "text-muted-foreground hover:text-sacred"
              }`}
            >
              🏹 मिलान खेल
            </button>
          </div>

          {/* Game Card */}
          <div
            className="game-card p-5 sm:p-8"
            style={{ backdropFilter: "blur(20px)" }}
          >
            {/* Game Header */}
            <div className="mb-6">
              {activeTab === "quiz" ? (
                <>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold mb-1">
                    पंडित जी प्रश्नोत्तरी
                  </h2>
                  <p className="font-crimson text-muted-foreground text-base">
                    Pandit Ji will ask you 10 spiritual questions. Answer wisely!
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-gold mb-1">
                    धनुष-बाण मिलान
                  </h2>
                  <p className="font-crimson text-muted-foreground text-base">
                    Select from left, then match from right. Fire your arrow of knowledge!
                  </p>
                </>
              )}
              <div className="divider-sacred mt-4" />
            </div>

            {/* Game Components */}
            {activeTab === "quiz" ? <PanditJiQuiz /> : <MatchGame />}
          </div>

          {/* Footer mantra */}
          <div className="text-center mt-10 space-y-2">
            <div className="divider-sacred" />
            <p className="font-devanagari text-muted-foreground/60 text-sm mt-4">
              ॐ शान्तिः शान्तिः शान्तिः ॥
            </p>
            <p className="font-cinzel text-xs tracking-widest text-muted-foreground/40 uppercase">
              Naman Darshan · Spiritual Learning
            </p>
          </div>
        </main>
      </div>

      {/* CSS for keyframes used inline */}
      <style>{`
        @keyframes arrow-fly {
          0% { transform: translateX(-60px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(300px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Index;
