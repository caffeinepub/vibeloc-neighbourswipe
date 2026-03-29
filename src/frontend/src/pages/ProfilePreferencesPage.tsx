import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { toast } from "sonner";
import AuthButton from "../components/auth/AuthButton";
import PreferencesEditor from "../components/profile/PreferencesEditor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePreferences } from "../hooks/usePreferences";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function ProfilePreferencesPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { preferences, savePreferences, isSaving } = usePreferences();

  const isAuthenticated = !!identity;

  const handleSavePreferences = async (newPreferences: any) => {
    try {
      await savePreferences(newPreferences);
      toast.success("Preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to update preferences");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {isAuthenticated && userProfile
                      ? userProfile.name
                      : "Guest"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated ? "Signed in" : "Not signed in"}
                  </p>
                </div>
              </div>
              <AuthButton />
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-xl font-bold">Your Preferences</h2>
          <PreferencesEditor
            initialPreferences={preferences}
            onSave={handleSavePreferences}
            isSaving={isSaving}
          />
        </div>
      </div>

      <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} VibeLoc. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined"
                ? window.location.hostname
                : "vibeloc",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
