import { useState } from "react";
import { usePreferences } from "../../hooks/usePreferences";
import type { RenterPreferences } from "../../types/preferences";
import PreferencesEditor from "../profile/PreferencesEditor";

type Phase = "splash" | "preferences" | "complete";

interface FirstLaunchFlowProps {
  onComplete: () => void;
}

const DARK_BG =
  "linear-gradient(160deg, #1a0533 0%, #120825 50%, #0a0010 100%)";

export default function FirstLaunchFlow({ onComplete }: FirstLaunchFlowProps) {
  const [phase, setPhase] = useState<Phase>("splash");
  const [fading, setFading] = useState(false);
  const { savePreferences, isSaving } = usePreferences();

  const transitionTo = (next: Phase) => {
    setFading(true);
    setTimeout(() => {
      setPhase(next);
      setFading(false);
    }, 350);
  };

  const handleSave = async (preferences: RenterPreferences) => {
    await savePreferences(preferences);
    transitionTo("complete");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      {/* Keyframe styles */}
      <style>{`
        @keyframes flf-pin-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(139,92,246,0.6)) drop-shadow(0 0 28px rgba(168,85,247,0.35));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 24px rgba(139,92,246,0.9)) drop-shadow(0 0 48px rgba(168,85,247,0.55));
            transform: scale(1.04);
          }
        }
        .flf-logo-pulse {
          animation: flf-pin-pulse 2.4s ease-in-out infinite;
        }
        .flf-btn {
          width: 100%;
          padding: 1rem 2rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
          color: #fff;
          font-size: 1.0625rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 32px rgba(139,92,246,0.45), 0 4px 24px rgba(0,0,0,0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .flf-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 0 48px rgba(139,92,246,0.6), 0 4px 32px rgba(0,0,0,0.5);
        }
        .flf-btn:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* ── SPLASH ──────────────────────────────────────────────────── */}
      {phase === "splash" && (
        <div
          data-ocid="splash.modal"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: DARK_BG,
            padding: "2rem",
          }}
        >
          {/* Ambient orbs */}
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

          {/* Centre content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              width: "100%",
              maxWidth: "360px",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <img
                src="/assets/generated/vibeloc-logo-pin-pulse-transparent.dim_400x400.png"
                alt="VibeLoc pin and pulse logo"
                className="flf-logo-pulse"
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "contain",
                }}
              />
            </div>

            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                margin: 0,
                textAlign: "center",
              }}
            >
              VibeLoc
            </h1>

            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(196,170,255,0.55)",
                textAlign: "center",
              }}
            >
              by GJilani
            </p>

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

          {/* CTA */}
          <div
            style={{ width: "100%", maxWidth: "360px", paddingBottom: "2rem" }}
          >
            <button
              type="button"
              className="flf-btn"
              data-ocid="splash.primary_button"
              onClick={() => transitionTo("preferences")}
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
              Set up your preferences in 5 quick steps
            </p>
          </div>
        </div>
      )}

      {/* ── PREFERENCES ─────────────────────────────────────────────── */}
      {phase === "preferences" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Mini header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "1.5rem",
              paddingBottom: "0.25rem",
            }}
          >
            <img
              src="/assets/generated/vibeloc-logo-pin-pulse-transparent.dim_400x400.png"
              alt="VibeLoc"
              style={{ width: "48px", height: "48px", objectFit: "contain" }}
            />
            <p
              style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(139,92,246,0.55)",
                marginTop: "0.25rem",
              }}
            >
              by GJilani
            </p>
          </div>

          <div
            style={{
              maxWidth: "480px",
              margin: "0 auto",
              padding: "1rem 1.25rem 3rem",
            }}
          >
            <PreferencesEditor onSave={handleSave} isSaving={isSaving} />
          </div>
        </div>
      )}

      {/* ── COMPLETE ────────────────────────────────────────────────── */}
      {phase === "complete" && (
        <div
          data-ocid="onboarding.success_state"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: DARK_BG,
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {/* Ambient orbs */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
              marginBottom: "2.5rem",
            }}
          >
            <img
              src="/assets/generated/vibeloc-logo-pin-pulse-transparent.dim_400x400.png"
              alt="VibeLoc"
              className="flf-logo-pulse"
              style={{
                width: "130px",
                height: "130px",
                objectFit: "contain",
                marginBottom: "1.25rem",
              }}
            />

            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                margin: 0,
              }}
            >
              VibeLoc
            </h1>

            <p
              style={{
                marginTop: "0.4rem",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(196,170,255,0.55)",
              }}
            >
              by GJilani
            </p>

            <div style={{ marginTop: "2rem" }}>
              <p
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "#c084fc",
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                You're all set! 🎉
              </p>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.68)",
                  lineHeight: 1.6,
                  maxWidth: "280px",
                }}
              >
                Your neighbourhood matches are ready.
                <br />
                Start discovering Nairobi.
              </p>
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: "360px" }}>
            <button
              type="button"
              className="flf-btn"
              data-ocid="onboarding.primary_button"
              onClick={onComplete}
            >
              Start Discovering
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
