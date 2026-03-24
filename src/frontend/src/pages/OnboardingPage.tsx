import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import OnboardingForm from "../components/onboarding/OnboardingForm";
import { usePreferences } from "../hooks/usePreferences";
import type { RenterPreferences } from "../types/preferences";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { savePreferences, isSaving } = usePreferences();

  const handleComplete = async (preferences: RenterPreferences) => {
    try {
      await savePreferences(preferences);
      toast.success(
        "Preferences saved! Let's find your perfect neighbourhood.",
      );
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-8rem)] bg-cover bg-center"
      style={{
        backgroundImage:
          "url(/assets/generated/onboarding-background.dim_1080x1920.png)",
      }}
    >
      <div className="min-h-[calc(100vh-8rem)] bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-6 text-center">
            <img
              src="/assets/generated/vibeloc-logo-pin-pulse-transparent.dim_400x400.png"
              alt="VibeLoc"
              className="mx-auto h-20 w-20"
            />
            <p className="mt-2 text-[11px] tracking-widest text-muted-foreground/50 uppercase">
              by GJilani
            </p>
          </div>
          <OnboardingForm onComplete={handleComplete} isSaving={isSaving} />
        </div>
      </div>
    </div>
  );
}
