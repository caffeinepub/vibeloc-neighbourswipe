import { useCallback, useEffect, useRef, useState } from "react";

interface SwipeHintOverlayProps {
  onDismiss: () => void;
}

export default function SwipeHintOverlay({ onDismiss }: SwipeHintOverlayProps) {
  const [phase, setPhase] = useState<"idle" | "right" | "left">("idle");
  const [showLike, setShowLike] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.setItem("vibeloc_swipe_hint_seen", "1");
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    const sequence = [
      {
        delay: 400,
        action: () => {
          setPhase("right");
          setShowLike(true);
          setShowPass(false);
        },
      },
      {
        delay: 1000,
        action: () => {
          setPhase("idle");
          setShowLike(false);
        },
      },
      {
        delay: 1400,
        action: () => {
          setPhase("left");
          setShowPass(true);
          setShowLike(false);
        },
      },
      {
        delay: 2000,
        action: () => {
          setPhase("idle");
          setShowPass(false);
        },
      },
      {
        delay: 2400,
        action: () => {
          setPhase("right");
          setShowLike(true);
        },
      },
      {
        delay: 3000,
        action: () => {
          setPhase("idle");
          setShowLike(false);
        },
      },
      {
        delay: 3400,
        action: () => {
          setPhase("left");
          setShowPass(true);
        },
      },
      {
        delay: 4000,
        action: () => {
          setPhase("idle");
          setShowPass(false);
        },
      },
      { delay: 4400, action: () => dismiss() },
    ];

    const timers = sequence.map(({ delay, action }) =>
      setTimeout(action, delay),
    );

    timerRef.current = timers[timers.length - 1];

    return () => timers.forEach(clearTimeout);
  }, [dismiss]);

  const handTranslate =
    phase === "right"
      ? "translateX(52px)"
      : phase === "left"
        ? "translateX(-52px)"
        : "translateX(0px)";

  return (
    <button
      type="button"
      aria-label="Dismiss swipe hint"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl overflow-hidden cursor-pointer w-full border-0 p-0"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={dismiss}
      onTouchStart={dismiss}
      data-ocid="discover.swipe_hint.button"
    >
      {/* PASS label */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity duration-300"
        style={{ opacity: showPass ? 1 : 0.3 }}
      >
        <span className="text-2xl font-black tracking-widest text-red-400 drop-shadow-lg">
          ←
        </span>
        <span className="text-xl font-black tracking-widest text-red-400 drop-shadow-lg">
          PASS
        </span>
      </div>

      {/* LIKE label */}
      <div
        className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity duration-300"
        style={{ opacity: showLike ? 1 : 0.3 }}
      >
        <span className="text-xl font-black tracking-widest text-green-400 drop-shadow-lg">
          LIKE
        </span>
        <span className="text-2xl font-black tracking-widest text-green-400 drop-shadow-lg">
          →
        </span>
      </div>

      {/* Animated hand */}
      <div
        className="flex flex-col items-center gap-3"
        style={{
          transform: handTranslate,
          transition: "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className="text-6xl drop-shadow-xl select-none"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
        >
          👆
        </div>
        <span className="rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white backdrop-blur-sm">
          Swipe to discover
        </span>
      </div>

      {/* Tap to skip */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <span className="text-xs text-white/60 font-medium tracking-wide">
          Tap to skip
        </span>
      </div>
    </button>
  );
}
