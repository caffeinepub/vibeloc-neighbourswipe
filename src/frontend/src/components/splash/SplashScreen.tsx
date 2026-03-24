import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDismiss: () => void;
}

export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Trigger fade-in shortly after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleGetStarted = () => {
    setFadingOut(true);
    setTimeout(() => onDismiss(), 350);
  };

  return (
    <div
      data-ocid="splash.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #1a0533 0%, #120825 50%, #0a0010 100%)",
        opacity: fadingOut ? 0 : visible ? 1 : 0,
        transition: fadingOut
          ? "opacity 0.35s ease-out"
          : "opacity 0.6s ease-in",
        padding: "2rem",
      }}
    >
      {/* Ambient background orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          flex: 1,
          justifyContent: "center",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        {/* Logo with pulsing glow */}
        <div
          className="splash-logo-container"
          style={{ marginBottom: "1.5rem" }}
        >
          <img
            src="/assets/generated/vibeloc-logo-pin-pulse-transparent.dim_400x400.png"
            alt="VibeLoc pin and pulse logo"
            style={{ width: "160px", height: "160px", objectFit: "contain" }}
          />
        </div>

        {/* Wordmark */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            margin: 0,
            textAlign: "center",
          }}
        >
          VibeLoc
        </h1>

        {/* by GJilani */}
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.6875rem",
            fontWeight: "600",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(196,170,255,0.55)",
            textAlign: "center",
          }}
        >
          by GJilani
        </p>

        {/* Tagline */}
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "1.0625rem",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
            lineHeight: 1.5,
            letterSpacing: "0.01em",
            maxWidth: "280px",
          }}
        >
          Goated neighbourhood — Match a vibe
        </p>
      </div>

      {/* Get Started button */}
      <div style={{ width: "100%", maxWidth: "360px", paddingBottom: "2rem" }}>
        <button
          data-ocid="splash.primary_button"
          type="button"
          onClick={handleGetStarted}
          style={{
            width: "100%",
            padding: "1rem 2rem",
            borderRadius: "9999px",
            background:
              "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
            color: "#ffffff",
            fontSize: "1.0625rem",
            fontWeight: "700",
            letterSpacing: "0.02em",
            border: "none",
            cursor: "pointer",
            boxShadow:
              "0 0 32px rgba(139,92,246,0.45), 0 4px 24px rgba(0,0,0,0.4)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.03)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 48px rgba(139,92,246,0.6), 0 4px 32px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 32px rgba(139,92,246,0.45), 0 4px 24px rgba(0,0,0,0.4)";
          }}
          onTouchStart={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(0.98)";
          }}
          onTouchEnd={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          Get Started
        </button>

        <p
          style={{
            marginTop: "0.875rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "rgba(196,170,255,0.4)",
            letterSpacing: "0.03em",
          }}
        >
          Discover Nairobi's best neighbourhoods
        </p>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes splash-pin-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 28px rgba(168, 85, 247, 0.35));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 24px rgba(139, 92, 246, 0.9)) drop-shadow(0 0 48px rgba(168, 85, 247, 0.55));
            transform: scale(1.04);
          }
        }
        .splash-logo-container img {
          animation: splash-pin-pulse 2.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
