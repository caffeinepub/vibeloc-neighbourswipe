import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import type { RenterPreferences } from "../../types/preferences";

const LIFESTYLE_OPTIONS = [
  "nightlife",
  "cafes",
  "quiet",
  "family-friendly",
  "modern",
  "affordable",
  "central",
  "green",
  "shopping",
  "restaurants",
  "transport",
  "community",
];

interface PreferencesEditorProps {
  initialPreferences?: RenterPreferences | null;
  onSave: (preferences: RenterPreferences) => Promise<void>;
  isSaving: boolean;
}

export default function PreferencesEditor({
  initialPreferences,
  onSave,
  isSaving,
}: PreferencesEditorProps) {
  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [dailyActivityAreas, setDailyActivityAreas] = useState("");
  const [commuteMaxMinutes, setCommuteMaxMinutes] = useState(30);
  const [lifestyleTags, setLifestyleTags] = useState<string[]>([]);
  const [mainTransportStyle, setMainTransportStyle] = useState("");
  const [biggestDealBreaker, setBiggestDealBreaker] = useState("");

  useEffect(() => {
    if (initialPreferences) {
      setBudgetMin(initialPreferences.budgetMin);
      setBudgetMax(initialPreferences.budgetMax);
      setDailyActivityAreas(initialPreferences.dailyActivityAreas.join(", "));
      setCommuteMaxMinutes(initialPreferences.commuteMaxMinutes);
      setLifestyleTags(initialPreferences.lifestyleTags);
      setMainTransportStyle(initialPreferences.mainTransportStyle || "");
      setBiggestDealBreaker(initialPreferences.biggestDealBreaker || "");
    }
  }, [initialPreferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse daily activity areas from comma-separated string
    const areasArray = dailyActivityAreas
      .split(",")
      .map((area) => area.trim())
      .filter((area) => area.length > 0);

    await onSave({
      budgetMin,
      budgetMax,
      dailyActivityAreas: areasArray,
      commuteMaxMinutes,
      lifestyleTags,
      mainTransportStyle,
      biggestDealBreaker,
    });
  };

  const toggleTag = (tag: string) => {
    setLifestyleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Range (KES/month)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Min: KES {budgetMin.toLocaleString()}</span>
              <span>Max: KES {budgetMax.toLocaleString()}</span>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Minimum Budget</Label>
                <Slider
                  value={[budgetMin]}
                  onValueChange={([value]) =>
                    setBudgetMin(Math.min(value, budgetMax - 5000))
                  }
                  min={5000}
                  max={100000}
                  step={5000}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Maximum Budget</Label>
                <Slider
                  value={[budgetMax]}
                  onValueChange={([value]) =>
                    setBudgetMax(Math.max(value, budgetMin + 5000))
                  }
                  min={5000}
                  max={100000}
                  step={5000}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commute Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dailyActivityAreas">Daily activity areas</Label>
            <Input
              id="dailyActivityAreas"
              placeholder="e.g., Westlands, CBD, Upperhill"
              value={dailyActivityAreas}
              onChange={(e) => setDailyActivityAreas(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple areas with commas
            </p>
          </div>
          <div className="space-y-2">
            <Label>Max Commute Time: {commuteMaxMinutes} minutes</Label>
            <Slider
              value={[commuteMaxMinutes]}
              onValueChange={([value]) => setCommuteMaxMinutes(value)}
              min={10}
              max={60}
              step={5}
              className="mt-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainTransportStyle">Main transport style</Label>
            <Input
              id="mainTransportStyle"
              placeholder="e.g., Car, Matatu, Uber, Walking"
              value={mainTransportStyle}
              onChange={(e) => setMainTransportStyle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {LIFESTYLE_OPTIONS.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={lifestyleTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                <Label
                  htmlFor={tag}
                  className="cursor-pointer text-sm capitalize"
                >
                  {tag.replace("-", " ")}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deal Breakers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="biggestDealBreaker">Biggest deal breaker</Label>
          <Input
            id="biggestDealBreaker"
            placeholder="e.g., No parking, Too noisy, Far from amenities"
            value={biggestDealBreaker}
            onChange={(e) => setBiggestDealBreaker(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
}
