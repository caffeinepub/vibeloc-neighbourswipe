import type { RenterPreferences } from "../../types/preferences";
import PreferencesEditor from "../profile/PreferencesEditor";

interface OnboardingFormProps {
  onComplete: (preferences: RenterPreferences) => Promise<void>;
  isSaving: boolean;
}

export default function OnboardingForm({
  onComplete,
  isSaving,
}: OnboardingFormProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Find Your Perfect Neighbourhood</h2>
        <p className="mt-2 text-muted-foreground">
          Tell us about your preferences to get personalized recommendations
        </p>
      </div>
      <PreferencesEditor onSave={onComplete} isSaving={isSaving} />
    </div>
  );
}
