import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronLeft, Loader2, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { RenterPreferences } from "../../types/preferences";

// ─── Data ────────────────────────────────────────────────────────────────────

const WORK_TYPES = [
  "Remote",
  "Gig Worker",
  "Formal Employment",
  "Informal / Self-employed",
  "Student",
  "Business Owner",
];

const NAIROBI_AREAS = [
  // CBD Core
  "Nairobi CBD",
  "Ngara",
  "Pangani",
  "Eastleigh",
  "Upper Hill",
  // Waiyaki Way
  "Westlands",
  "Spring Valley",
  "Loresho",
  "Kangemi",
  "Mountain View",
  "Uthiru",
  "Kinoo",
  "Kikuyu",
  "Regen",
  // Northern Heights
  "Parklands",
  "Muthaiga",
  "Gigiri",
  "Rosslyn",
  "Runda",
  "Ruaka",
  // Ngong Road
  "Kilimani",
  "Hurlingham",
  "Kileleshwa",
  "Lavington",
  "Adams Arcade",
  "Riruta",
  "Kawangware",
  "Karen",
  // Thika Road
  "Roasters",
  "Ngumba Estate",
  "Roysambu",
  "Zimmerman",
  "Kasarani",
  "Githurai",
  "Kahawa Wendani",
  "Kahawa Sukari",
  "Northlands",
  "Ruiru",
  "Juja",
  "Witeithie",
  "Thika",
  // Southern Corridor
  "South C",
  "South B",
  "Industrial Area",
  "Imara Daima",
  "Embakasi",
  "Syokimau",
  "Mlolongo",
  // Langata Belt
  "Madaraka Estate",
  "Dam Estate",
  "Otiende",
  "Onyonka",
  "Ngei",
  "Langata",
  // Eastlands
  "Kariobangi",
  "Dandora",
  "Buruburu",
  "Donholm",
  "Umoja",
  "Kayole",
  "Komarock",
  "Fedha Estate",
  // Kiambu Belt
  "Wangige",
  "Kingeero",
  "Gachie",
  "Kiambu Town",
  "Kirigiti",
  "Thindigua",
  "Ridgeways",
  "Marurui",
  "Garden Estate",
  "Thome",
  "Kahawa West",
  // Kajiado Belt
  "Kitengela",
  "Ongata Rongai",
  "Kiserian",
  "Ngong",
  "Isinya",
  // Eastern Bypass / Kangundo
  "Utawala",
  "Ruai",
  "OJ",
  "Tatu City",
  "Kamakis",
  "Membly",
  "Kamulu",
  "Joska",
  "Infinity",
];

const LIFESTYLE_VIBES = [
  "Nightlife",
  "Cafes & Restaurants",
  "Quiet & Peaceful",
  "Family-Friendly",
  "Modern & Upscale",
  "Affordable",
  "Central",
  "Green Spaces",
  "Shopping",
  "Community Feel",
  "Good Transport",
  "Student-Friendly",
];

const TRANSPORT_OPTIONS = [
  "Matatu",
  "Personal Car",
  "Bodaboda",
  "Walking",
  "Uber / Bolt",
  "SGR / Train",
];

const DEAL_BREAKERS = [
  "Flooding",
  "No Parking",
  "Too Noisy",
  "Poor Security",
  "Far from Amenities",
  "Heavy Traffic",
];

const TOTAL_STEPS = 5;

// ─── Types ───────────────────────────────────────────────────────────────────

interface WizardState {
  workType: string;
  dailyActivityAreas: string[];
  lifestyleTags: string[];
  mainTransportStyle: string;
  biggestDealBreaker: string;
  commuteMaxMinutes: number;
  budgetMin: number;
  budgetMax: number;
}

interface PreferencesEditorProps {
  initialPreferences?: RenterPreferences | null;
  onSave: (preferences: RenterPreferences) => Promise<void>;
  isSaving: boolean;
}

// ─── Chip Component ──────────────────────────────────────────────────────────

function Chip({
  label,
  selected,
  onClick,
  "data-ocid": dataOcid,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  "data-ocid"?: string;
}) {
  return (
    <button
      type="button"
      data-ocid={dataOcid}
      onClick={onClick}
      className={cn(
        "rounded-full border-2 px-3 py-2 text-sm font-medium transition-all duration-200 text-left leading-tight",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:border-primary/60 hover:bg-muted/50",
      )}
    >
      {label}
    </button>
  );
}

// ─── Step Components ─────────────────────────────────────────────────────────

function StepWorkType({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">
          How do you work?
        </h2>
        <p className="text-sm text-muted-foreground">
          Helps us rank neighbourhoods that match how you work and move around
          the city.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {WORK_TYPES.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            data-ocid="preferences.work_type.toggle"
          />
        ))}
      </div>
    </div>
  );
}

function StepActivityAreas({
  value,
  onChange,
}: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (area: string) =>
    onChange(
      value.includes(area)
        ? value.filter((a) => a !== area)
        : value.length < 5
          ? [...value, area]
          : value,
    );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">
          Daily activity areas
        </h2>
        <p className="text-sm text-muted-foreground">
          Select all areas you spend time in daily — work, school, errands.
          We'll prioritise nearby neighbourhoods.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Selected:</span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            value.length > 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
          data-ocid="preferences.activity_areas.select"
        >
          {value.length} / 5
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {NAIROBI_AREAS.map((area) => (
          <Chip
            key={area}
            label={area}
            selected={value.includes(area)}
            onClick={() => toggle(area)}
            data-ocid="preferences.activity_area.toggle"
          />
        ))}
      </div>
    </div>
  );
}

function StepLifestyleCommute({
  lifestyleTags,
  transportStyle,
  dealBreaker,
  commuteMax,
  onLifestyleChange,
  onTransportChange,
  onDealBreakerChange,
  onCommuteChange,
}: {
  lifestyleTags: string[];
  transportStyle: string;
  dealBreaker: string;
  commuteMax: number;
  onLifestyleChange: (v: string[]) => void;
  onTransportChange: (v: string) => void;
  onDealBreakerChange: (v: string) => void;
  onCommuteChange: (v: number) => void;
}) {
  const toggleLifestyle = (tag: string) =>
    onLifestyleChange(
      lifestyleTags.includes(tag)
        ? lifestyleTags.filter((t) => t !== tag)
        : [...lifestyleTags, tag],
    );

  return (
    <div className="space-y-7">
      {/* Vibe */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Your lifestyle vibe
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick all that resonate — we'll find neighbourhoods that match your
            energy.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LIFESTYLE_VIBES.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected={lifestyleTags.includes(tag)}
              onClick={() => toggleLifestyle(tag)}
              data-ocid="preferences.lifestyle.toggle"
            />
          ))}
        </div>
      </div>

      {/* Transport */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Main transport
          </h3>
          <p className="text-sm text-muted-foreground">
            Your primary way of getting around shapes which areas suit you.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TRANSPORT_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={transportStyle === opt}
              onClick={() =>
                onTransportChange(transportStyle === opt ? "" : opt)
              }
              data-ocid="preferences.transport.toggle"
            />
          ))}
        </div>
      </div>

      {/* Deal Breaker */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Biggest deal breaker
          </h3>
          <p className="text-sm text-muted-foreground">
            One thing that would make a neighbourhood a no-go for you.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEAL_BREAKERS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={dealBreaker === opt}
              onClick={() =>
                onDealBreakerChange(dealBreaker === opt ? "" : opt)
              }
              data-ocid="preferences.deal_breaker.toggle"
            />
          ))}
        </div>
      </div>

      {/* Commute slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Max commute time
          </h3>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {commuteMax} min
          </span>
        </div>
        <Slider
          value={[commuteMax]}
          onValueChange={([v]) => onCommuteChange(v)}
          min={10}
          max={60}
          step={5}
          data-ocid="preferences.commute.toggle"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10 min</span>
          <span>60 min</span>
        </div>
      </div>
    </div>
  );
}

function StepBudget({
  budgetMin,
  budgetMax,
  onMinChange,
  onMaxChange,
}: {
  budgetMin: number;
  budgetMax: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">
          Your rent budget
        </h2>
        <p className="text-sm text-muted-foreground">
          Sets the rent range we use to filter and rank listings in each
          neighbourhood.
        </p>
      </div>

      {/* Live range display */}
      <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 px-5 py-4 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Monthly Rent Range
        </p>
        <p className="mt-1 text-2xl font-bold text-primary">
          KES {budgetMin.toLocaleString()} – KES {budgetMax.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">per month</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Minimum</span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              KES {budgetMin.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[budgetMin]}
            onValueChange={([v]) => onMinChange(Math.min(v, budgetMax - 5000))}
            min={5000}
            max={100000}
            step={5000}
            data-ocid="preferences.budget_min.toggle"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Maximum</span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              KES {budgetMax.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[budgetMax]}
            onValueChange={([v]) => onMaxChange(Math.max(v, budgetMin + 5000))}
            min={5000}
            max={100000}
            step={5000}
            data-ocid="preferences.budget_max.toggle"
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>KES 5,000</span>
        <span>KES 100,000</span>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">
          {value || (
            <span className="italic text-muted-foreground">Not set</span>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex shrink-0 items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
    </div>
  );
}

function StepReview({
  state,
  onJumpToStep,
  onSave,
  isSaving,
}: {
  state: WizardState;
  onJumpToStep: (step: number) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Review & Save</h2>
        <p className="text-sm text-muted-foreground">
          Everything looks good? Save to start discovering neighbourhoods
          matched to you.
        </p>
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        <div className="px-4">
          <SummaryRow
            label="Work Type"
            value={state.workType}
            onEdit={() => onJumpToStep(1)}
          />
        </div>
        <div className="px-4">
          <SummaryRow
            label="Daily Activity Areas"
            value={
              state.dailyActivityAreas.length > 0
                ? state.dailyActivityAreas.join(", ")
                : ""
            }
            onEdit={() => onJumpToStep(2)}
          />
        </div>
        <div className="px-4">
          <SummaryRow
            label="Lifestyle Vibes"
            value={
              state.lifestyleTags.length > 0
                ? state.lifestyleTags.join(", ")
                : ""
            }
            onEdit={() => onJumpToStep(3)}
          />
        </div>
        <div className="px-4">
          <SummaryRow
            label="Transport"
            value={state.mainTransportStyle}
            onEdit={() => onJumpToStep(3)}
          />
        </div>
        <div className="px-4">
          <SummaryRow
            label="Deal Breaker"
            value={state.biggestDealBreaker}
            onEdit={() => onJumpToStep(3)}
          />
        </div>
        <div className="px-4">
          <SummaryRow
            label="Max Commute"
            value={
              state.commuteMaxMinutes
                ? `${state.commuteMaxMinutes} minutes`
                : ""
            }
            onEdit={() => onJumpToStep(3)}
          />
        </div>
        <div className="px-4">
          <SummaryRow
            label="Budget"
            value={`KES ${state.budgetMin.toLocaleString()} – KES ${state.budgetMax.toLocaleString()} / month`}
            onEdit={() => onJumpToStep(4)}
          />
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        You can update your preferences anytime from your profile.
      </p>

      <Button
        type="button"
        className="w-full"
        disabled={isSaving}
        onClick={onSave}
        data-ocid="preferences.submit_button"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Save Preferences
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

export default function PreferencesEditor({
  initialPreferences,
  onSave,
  isSaving,
}: PreferencesEditorProps) {
  const init: WizardState = {
    workType: initialPreferences?.workType ?? "",
    dailyActivityAreas: initialPreferences?.dailyActivityAreas ?? [],
    lifestyleTags: initialPreferences?.lifestyleTags ?? [],
    mainTransportStyle: initialPreferences?.mainTransportStyle ?? "",
    biggestDealBreaker: initialPreferences?.biggestDealBreaker ?? "",
    commuteMaxMinutes: initialPreferences?.commuteMaxMinutes ?? 30,
    budgetMin: initialPreferences?.budgetMin ?? 15000,
    budgetMax: initialPreferences?.budgetMax ?? 50000,
  };

  const [state, setState] = useState<WizardState>(init);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const goTo = (next: number, dir: "forward" | "back") => {
    setDirection(dir);
    setStep(next);
  };

  const next = () => goTo(step + 1, "forward");
  const back = () => goTo(step - 1, "back");
  const jumpTo = (s: number) => goTo(s, s < step ? "back" : "forward");

  const canNext =
    step === 1
      ? state.workType !== ""
      : step === 2
        ? state.dailyActivityAreas.length > 0
        : true;

  const handleSave = async () => {
    await onSave({
      workType: state.workType,
      dailyActivityAreas: state.dailyActivityAreas,
      lifestyleTags: state.lifestyleTags,
      mainTransportStyle: state.mainTransportStyle,
      biggestDealBreaker: state.biggestDealBreaker,
      commuteMaxMinutes: state.commuteMaxMinutes,
      budgetMin: state.budgetMin,
      budgetMax: state.budgetMax,
    });
  };

  const variants = {
    enter: (dir: "forward" | "back") => ({
      x: dir === "forward" ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "forward" | "back") => ({
      x: dir === "forward" ? -60 : 60,
      opacity: 0,
    }),
  };

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            data-ocid="preferences.loading_state"
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-0.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
            (stepNum) => (
              <div
                key={stepNum}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  stepNum === step
                    ? "w-5 bg-primary"
                    : stepNum < step
                      ? "w-1.5 bg-primary/50"
                      : "w-1.5 bg-border",
                )}
              />
            ),
          )}
        </div>
      </div>

      {/* Animated step content */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {step === 1 && (
              <StepWorkType
                value={state.workType}
                onChange={(v) => setState((p) => ({ ...p, workType: v }))}
              />
            )}
            {step === 2 && (
              <StepActivityAreas
                value={state.dailyActivityAreas}
                onChange={(v) =>
                  setState((p) => ({ ...p, dailyActivityAreas: v }))
                }
              />
            )}
            {step === 3 && (
              <StepLifestyleCommute
                lifestyleTags={state.lifestyleTags}
                transportStyle={state.mainTransportStyle}
                dealBreaker={state.biggestDealBreaker}
                commuteMax={state.commuteMaxMinutes}
                onLifestyleChange={(v) =>
                  setState((p) => ({ ...p, lifestyleTags: v }))
                }
                onTransportChange={(v) =>
                  setState((p) => ({ ...p, mainTransportStyle: v }))
                }
                onDealBreakerChange={(v) =>
                  setState((p) => ({ ...p, biggestDealBreaker: v }))
                }
                onCommuteChange={(v) =>
                  setState((p) => ({ ...p, commuteMaxMinutes: v }))
                }
              />
            )}
            {step === 4 && (
              <StepBudget
                budgetMin={state.budgetMin}
                budgetMax={state.budgetMax}
                onMinChange={(v) => setState((p) => ({ ...p, budgetMin: v }))}
                onMaxChange={(v) => setState((p) => ({ ...p, budgetMax: v }))}
              />
            )}
            {step === 5 && (
              <StepReview
                state={state}
                onJumpToStep={jumpTo}
                onSave={handleSave}
                isSaving={isSaving}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              className="flex items-center gap-1"
              data-ocid="preferences.secondary_button"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="min-w-[100px]"
            data-ocid="preferences.primary_button"
          >
            {step === 4 ? "Review" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}
