import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  Layers,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NAIROBI_NEIGHBOURHOODS } from "../data/neighbourhoodCatalog";
import { usePostPulse, usePostSpaceListing } from "../hooks/useQueries";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPACE_TYPES = [
  { value: "Airbnb", label: "🏠 Airbnb / Short-stay", priceUnit: "/night" },
  { value: "Rental", label: "🔑 Long-term Rental", priceUnit: "/month" },
  { value: "Commercial", label: "🏢 Commercial Space", priceUnit: "/month" },
  {
    value: "Student Housing",
    label: "🎓 Student Housing",
    priceUnit: "/month",
  },
  { value: "Co-living", label: "🤝 Shared / Co-living", priceUnit: "/month" },
  {
    value: "Co-working",
    label: "💼 Office / Co-working",
    priceUnit: "/desk/month",
  },
  { value: "Land", label: "🌱 Land / Plot", priceUnit: "/plot" },
] as const;

const INSIGHT_TYPES = [
  { value: "Neighbourhood Review", label: "⭐ Neighbourhood Review" },
  { value: "Infrastructure Update", label: "🔧 Infrastructure Update" },
  { value: "New Business Opening", label: "🆕 New Business Opening" },
  { value: "Hidden Gem", label: "💎 Hidden Gem" },
] as const;

const COMMUNITY_TYPES = [
  { value: "Local Event", label: "🎉 Local Event" },
  { value: "Skills / Service Offered", label: "🛠️ Skills / Service Offered" },
  { value: "Creative Opportunity", label: "🎨 Creative Opportunity" },
  { value: "DeSci Project", label: "🔬 DeSci Project" },
  { value: "Community Initiative", label: "🌿 Community Initiative" },
] as const;

const MAX_DESCRIPTION = 500;

type TabId = "spaces" | "insights" | "community";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "spaces",
    label: "Spaces",
    icon: <Building2 className="h-3.5 w-3.5" />,
  },
  {
    id: "insights",
    label: "Insights & Vibes",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  {
    id: "community",
    label: "Community & Events",
    icon: <CalendarDays className="h-3.5 w-3.5" />,
  },
];

// ─── Sub-forms ────────────────────────────────────────────────────────────────

function NeighbourhoodSelect({
  value,
  onChange,
  error,
  disabled,
  id,
  ocid,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
  id: string;
  ocid: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        Neighbourhood <span className="text-destructive">*</span>
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          data-ocid={ocid}
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder="Select a neighbourhood" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {NAIROBI_NEIGHBOURHOODS.map((n) => (
            <SelectItem key={n.id} value={n.name}>
              {n.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p data-ocid={`${ocid}_error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Spaces Tab ───────────────────────────────────────────────────────────────

function SpacesForm() {
  const navigate = useNavigate();
  const postListingMutation = usePostSpaceListing();

  const [title, setTitle] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedType = SPACE_TYPES.find((t) => t.value === spaceType);
  const isPending = postListingMutation.isPending;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!neighbourhood) errs.neighbourhood = "Please select a neighbourhood";
    if (!spaceType) errs.spaceType = "Please select a space type";
    if (!price || Number(price) <= 0)
      errs.price = "Please enter a valid price greater than 0";
    if (!description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await postListingMutation.mutateAsync({
        title: title.trim(),
        neighbourhood,
        spaceType,
        price: BigInt(Math.round(Number(price))),
        description: description.trim(),
      });
      toast.success("Listing posted! 🎉");
      navigate({ to: "/matches" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to post listing. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Space Listing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="post-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="post-title"
              data-ocid="post.spaces.title_input"
              placeholder="e.g. Cosy 1BR near Westgate Mall"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: "" }));
              }}
              disabled={isPending}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p
                data-ocid="post.spaces.title_error"
                className="text-xs text-destructive"
              >
                {errors.title}
              </p>
            )}
          </div>

          <NeighbourhoodSelect
            id="post-neighbourhood"
            ocid="post.spaces.neighbourhood_select"
            value={neighbourhood}
            onChange={(v) => {
              setNeighbourhood(v);
              if (errors.neighbourhood)
                setErrors((p) => ({ ...p, neighbourhood: "" }));
            }}
            error={errors.neighbourhood}
            disabled={isPending}
          />

          <div className="space-y-1.5">
            <Label htmlFor="post-space-type">
              Space Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={spaceType}
              onValueChange={(v) => {
                setSpaceType(v);
                if (errors.spaceType)
                  setErrors((p) => ({ ...p, spaceType: "" }));
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="post-space-type"
                data-ocid="post.spaces.type_select"
                className={errors.spaceType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a space type" />
              </SelectTrigger>
              <SelectContent>
                {SPACE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.spaceType && (
              <p
                data-ocid="post.spaces.type_error"
                className="text-xs text-destructive"
              >
                {errors.spaceType}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-price">
              Price (KES){" "}
              {selectedType && (
                <span className="text-muted-foreground text-xs font-normal">
                  {selectedType.priceUnit}
                </span>
              )}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                KES
              </span>
              <Input
                id="post-price"
                data-ocid="post.spaces.price_input"
                type="number"
                min="1"
                step="500"
                placeholder="e.g. 25000"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((p) => ({ ...p, price: "" }));
                }}
                disabled={isPending}
                className={`pl-12 ${errors.price ? "border-destructive" : ""}`}
              />
            </div>
            {errors.price && (
              <p
                data-ocid="post.spaces.price_error"
                className="text-xs text-destructive"
              >
                {errors.price}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs ${
                  description.length > MAX_DESCRIPTION
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="post-description"
              data-ocid="post.spaces.description_textarea"
              placeholder="Describe the space — size, amenities, what makes it great…"
              rows={4}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION)
                  setDescription(e.target.value);
                if (errors.description)
                  setErrors((p) => ({ ...p, description: "" }));
              }}
              disabled={isPending}
              className={`resize-none ${errors.description ? "border-destructive" : ""}`}
            />
            {errors.description && (
              <p
                data-ocid="post.spaces.description_error"
                className="text-xs text-destructive"
              >
                {errors.description}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-ocid="post.spaces.submit_button"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting…
              </>
            ) : (
              "Post Space Listing"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Insights & Vibes Tab ─────────────────────────────────────────────────────

function InsightsForm() {
  const navigate = useNavigate();
  const postPulseMutation = usePostPulse();

  const [neighbourhood, setNeighbourhood] = useState("");
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPending = postPulseMutation.isPending;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!neighbourhood) errs.neighbourhood = "Please select a neighbourhood";
    if (!postType) errs.postType = "Please select an insight type";
    if (!title.trim()) errs.title = "Title is required";
    if (!description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await postPulseMutation.mutateAsync({
        neighbourhood,
        category: "insights",
        postType,
        title: title.trim(),
        description: description.trim(),
      });
      toast.success("Insight shared! ✨");
      setNeighbourhood("");
      setPostType("");
      setTitle("");
      setDescription("");
      navigate({ to: "/matches" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to share insight");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Share a Neighbourhood Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <NeighbourhoodSelect
            id="insight-neighbourhood"
            ocid="post.insights.neighbourhood_select"
            value={neighbourhood}
            onChange={(v) => {
              setNeighbourhood(v);
              if (errors.neighbourhood)
                setErrors((p) => ({ ...p, neighbourhood: "" }));
            }}
            error={errors.neighbourhood}
            disabled={isPending}
          />

          <div className="space-y-1.5">
            <Label htmlFor="insight-type">
              Insight Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={postType}
              onValueChange={(v) => {
                setPostType(v);
                if (errors.postType) setErrors((p) => ({ ...p, postType: "" }));
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="insight-type"
                data-ocid="post.insights.type_select"
                className={errors.postType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="What kind of insight?" />
              </SelectTrigger>
              <SelectContent>
                {INSIGHT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.postType && (
              <p
                data-ocid="post.insights.type_error"
                className="text-xs text-destructive"
              >
                {errors.postType}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="insight-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="insight-title"
              data-ocid="post.insights.title_input"
              placeholder="e.g. Real talk on Kilimani nightlife noise levels"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: "" }));
              }}
              disabled={isPending}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p
                data-ocid="post.insights.title_error"
                className="text-xs text-destructive"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="insight-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs ${
                  description.length > MAX_DESCRIPTION
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="insight-description"
              data-ocid="post.insights.description_textarea"
              placeholder="Your honest take on the neighbourhood — what others need to know…"
              rows={4}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION)
                  setDescription(e.target.value);
                if (errors.description)
                  setErrors((p) => ({ ...p, description: "" }));
              }}
              disabled={isPending}
              className={`resize-none ${errors.description ? "border-destructive" : ""}`}
            />
            {errors.description && (
              <p
                data-ocid="post.insights.description_error"
                className="text-xs text-destructive"
              >
                {errors.description}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-ocid="post.insights.submit_button"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing…
              </>
            ) : (
              "Share Insight"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Community & Events Tab ───────────────────────────────────────────────────

function CommunityForm() {
  const navigate = useNavigate();
  const postPulseMutation = usePostPulse();

  const [neighbourhood, setNeighbourhood] = useState("");
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPending = postPulseMutation.isPending;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!neighbourhood) errs.neighbourhood = "Please select a neighbourhood";
    if (!postType) errs.postType = "Please select a post type";
    if (!title.trim()) errs.title = "Title is required";
    if (!description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await postPulseMutation.mutateAsync({
        neighbourhood,
        category: "community",
        postType,
        title: title.trim(),
        description: description.trim(),
        eventDate: date || undefined,
      });
      toast.success("Posted to community! 🌿");
      setNeighbourhood("");
      setPostType("");
      setTitle("");
      setDate("");
      setDescription("");
      navigate({ to: "/matches" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to post to community");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Post to Your Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <NeighbourhoodSelect
            id="community-neighbourhood"
            ocid="post.community.neighbourhood_select"
            value={neighbourhood}
            onChange={(v) => {
              setNeighbourhood(v);
              if (errors.neighbourhood)
                setErrors((p) => ({ ...p, neighbourhood: "" }));
            }}
            error={errors.neighbourhood}
            disabled={isPending}
          />

          <div className="space-y-1.5">
            <Label htmlFor="community-type">
              Post Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={postType}
              onValueChange={(v) => {
                setPostType(v);
                if (errors.postType) setErrors((p) => ({ ...p, postType: "" }));
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="community-type"
                data-ocid="post.community.type_select"
                className={errors.postType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="What are you posting?" />
              </SelectTrigger>
              <SelectContent>
                {COMMUNITY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.postType && (
              <p
                data-ocid="post.community.type_error"
                className="text-xs text-destructive"
              >
                {errors.postType}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="community-title"
              data-ocid="post.community.title_input"
              placeholder="e.g. Weekend market at Junction Mall"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: "" }));
              }}
              disabled={isPending}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p
                data-ocid="post.community.title_error"
                className="text-xs text-destructive"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-date">
              Date{" "}
              <span className="text-muted-foreground text-xs font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="community-date"
              data-ocid="post.community.date_input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isPending}
              className="block"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="community-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs ${
                  description.length > MAX_DESCRIPTION
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="community-description"
              data-ocid="post.community.description_textarea"
              placeholder="Tell the neighbourhood what's happening, what you're looking for, or how to get involved…"
              rows={4}
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION)
                  setDescription(e.target.value);
                if (errors.description)
                  setErrors((p) => ({ ...p, description: "" }));
              }}
              disabled={isPending}
              className={`resize-none ${errors.description ? "border-destructive" : ""}`}
            />
            {errors.description && (
              <p
                data-ocid="post.community.description_error"
                className="text-xs text-destructive"
              >
                {errors.description}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-ocid="post.community.submit_button"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting…
              </>
            ) : (
              "Post to Community"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PostPage() {
  const [activeTab, setActiveTab] = useState<TabId>("spaces");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-background py-5">
        <div className="container mx-auto max-w-lg px-4">
          <h1 className="text-2xl font-bold">Post</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share a space, neighbourhood insight, or community event
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-lg px-4">
          <div
            className="flex gap-1.5 py-3"
            role="tablist"
            aria-label="Post categories"
          >
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                data-ocid={`post.${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                ].join(" ")}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Icon header strip */}
      <div className="container mx-auto max-w-lg px-4 pt-4 pb-1">
        <div className="flex items-center gap-2">
          {activeTab === "spaces" && (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Spaces</p>
                <p className="text-xs text-muted-foreground">
                  List a property for rent, Airbnb, co-working & more
                </p>
              </div>
            </>
          )}
          {activeTab === "insights" && (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Insights & Vibes</p>
                <p className="text-xs text-muted-foreground">
                  Share what you know about your neighbourhood
                </p>
              </div>
            </>
          )}
          {activeTab === "community" && (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <CalendarDays className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Community & Events</p>
                <p className="text-xs text-muted-foreground">
                  Post events, skills, collabs & DeSci projects
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto max-w-lg px-4 py-4 pb-28">
        {activeTab === "spaces" && <SpacesForm />}
        {activeTab === "insights" && <InsightsForm />}
        {activeTab === "community" && <CommunityForm />}
      </div>
    </div>
  );
}
