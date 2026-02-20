import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
      audioRef.current.play().then(() => setStarted(true)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!started) startAudio();
    };
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });
    // Try autoplay immediately
    setTimeout(() => startAudio(), 500);
    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, [started]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
      if (!started) startAudio();
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/mantra.mp3" loop preload="auto" />
      <button
        onClick={toggleMute}
        title={muted ? "Unmute Mantra" : "Mute Mantra"}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center border border-gold/50 bg-card/80 backdrop-blur-sm transition-all hover:border-gold animate-pulse-glow"
        style={{ boxShadow: "0 0 20px hsl(42 95% 52% / 0.3)" }}
      >
        {muted ? (
          <VolumeX className="w-5 h-5 text-gold" />
        ) : (
          <Volume2 className="w-5 h-5 text-gold" />
        )}
      </button>
    </>
  );
};
