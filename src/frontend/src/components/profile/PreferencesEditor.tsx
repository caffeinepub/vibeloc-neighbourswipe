import { useState, useEffect } from 'react';
import { RenterPreferences } from '../../types/preferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LIFESTYLE_OPTIONS = [
  'nightlife', 'cafes', 'quiet', 'family-friendly', 'modern', 'affordable',
  'central', 'green', 'shopping', 'restaurants', 'transport', 'community',
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
  const [commuteArea, setCommuteArea] = useState('');
  const [commuteMaxMinutes, setCommuteMaxMinutes] = useState(30);
  const [lifestyleTags, setLifestyleTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialPreferences) {
      setBudgetMin(initialPreferences.budgetMin);
      setBudgetMax(initialPreferences.budgetMax);
      setCommuteArea(initialPreferences.commuteArea);
      setCommuteMaxMinutes(initialPreferences.commuteMaxMinutes);
      setLifestyleTags(initialPreferences.lifestyleTags);
    }
  }, [initialPreferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      budgetMin,
      budgetMax,
      commuteArea,
      commuteMaxMinutes,
      lifestyleTags,
    });
  };

  const toggleTag = (tag: string) => {
    setLifestyleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
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
                  onValueChange={([value]) => setBudgetMin(Math.min(value, budgetMax - 5000))}
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
                  onValueChange={([value]) => setBudgetMax(Math.max(value, budgetMin + 5000))}
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
            <Label htmlFor="commuteArea">Primary Work Area</Label>
            <Input
              id="commuteArea"
              placeholder="e.g., Westlands, CBD, Upperhill"
              value={commuteArea}
              onChange={(e) => setCommuteArea(e.target.value)}
            />
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
                <Label htmlFor={tag} className="cursor-pointer text-sm capitalize">
                  {tag.replace('-', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  );
}
