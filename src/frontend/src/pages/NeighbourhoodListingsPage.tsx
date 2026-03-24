import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  GraduationCap,
  Home,
  Laptop,
  Leaf,
  MapPin,
  MessageCircle,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PulsePost, SpaceListing } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteListing,
  useListingsByNeighbourhood,
  usePulsesByNeighbourhood,
} from "../hooks/useQueries";

const WHATSAPP_KEY = "vibeloc_whatsapp_number";

function getWhatsAppNumber(): string {
  const stored = localStorage.getItem(WHATSAPP_KEY);
  if (stored) return stored.replace(/\D/g, "");
  return "254700000000";
}

type SpaceFilter =
  | "All"
  | "Airbnb"
  | "Rental"
  | "Commercial"
  | "Student Housing"
  | "Co-living"
  | "Co-working"
  | "Land";

type PostTab = "spaces" | "insights" | "community";

const ALL_FILTERS: SpaceFilter[] = [
  "All",
  "Airbnb",
  "Rental",
  "Commercial",
  "Student Housing",
  "Co-living",
  "Co-working",
  "Land",
];

const FILTER_LABELS: Record<SpaceFilter, string> = {
  All: "All",
  Airbnb: "Airbnb",
  Rental: "Rental",
  Commercial: "Commercial",
  "Student Housing": "Student",
  "Co-living": "Co-living",
  "Co-working": "Co-working",
  Land: "Land",
};

function formatPrice(listing: SpaceListing): string {
  const amount = `KES ${Number(listing.price).toLocaleString()}`;
  switch (listing.spaceType) {
    case "Airbnb":
      return `${amount}/night`;
    case "Co-working":
      return `${amount}/desk/mo`;
    case "Land":
      return `${amount}/plot`;
    default:
      return `${amount}/mo`;
  }
}

function buildWhatsAppUrl(
  listing: SpaceListing,
  neighbourhood: string,
): string {
  const number = getWhatsAppNumber();
  const text = encodeURIComponent(
    `Hi VibeLoc, I'd like to enquire about this listing:\n\n*${listing.title}*\nType: ${listing.spaceType}\nPrice: ${formatPrice(listing)}\nNeighbourhood: ${neighbourhood}\n\nPlease assist with verification and next steps.`,
  );
  return `https://wa.me/${number}?text=${text}`;
}

function spaceTypeBadgeClass(spaceType: string): string {
  switch (spaceType) {
    case "Airbnb":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "Rental":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300";
    case "Commercial":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300";
    case "Student Housing":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300";
    case "Co-living":
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300";
    case "Co-working":
      return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300";
    case "Land":
      return "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function spaceTypeIcon(spaceType: string) {
  switch (spaceType) {
    case "Airbnb":
      return <Home className="h-3.5 w-3.5" />;
    case "Rental":
      return <MapPin className="h-3.5 w-3.5" />;
    case "Commercial":
      return <Building2 className="h-3.5 w-3.5" />;
    case "Student Housing":
      return <GraduationCap className="h-3.5 w-3.5" />;
    case "Co-living":
      return <Users className="h-3.5 w-3.5" />;
    case "Co-working":
      return <Laptop className="h-3.5 w-3.5" />;
    case "Land":
      return <Leaf className="h-3.5 w-3.5" />;
    default:
      return null;
  }
}

function truncatePrincipal(principal: string) {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 6)}\u2026${principal.slice(-4)}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Pulse Post Card ─────────────────────────────────────────────────────────

function PulseCard({
  pulse,
  callerPrincipal,
  index,
}: {
  pulse: PulsePost;
  callerPrincipal?: string;
  index: number;
}) {
  const isInsight = pulse.category === "insights";
  const isOwner =
    callerPrincipal && pulse.postedBy.toString() === callerPrincipal;

  return (
    <Card
      key={pulse.id.toString()}
      data-ocid={`listings.item.${index}`}
      className="overflow-hidden transition-shadow hover:shadow-md"
    >
      <div
        className={`h-full border-l-4 ${
          isInsight ? "border-amber-400" : "border-emerald-500"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    isInsight
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                  }`}
                >
                  {isInsight ? (
                    <Sparkles className="h-3 w-3" />
                  ) : (
                    <CalendarDays className="h-3 w-3" />
                  )}
                  {pulse.postType}
                </span>
              </div>
              <h3 className="mt-1.5 font-bold leading-snug">{pulse.title}</h3>
            </div>
          </div>

          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {pulse.description}
          </p>

          {pulse.eventDate && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{pulse.eventDate}</span>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Posted by{" "}
              <span className="font-medium">
                {isOwner ? "You" : truncatePrincipal(pulse.postedBy.toString())}
              </span>
            </span>
            <span>{formatDate(pulse.createdAt)}</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NeighbourhoodListingsPage() {
  const params = useParams({ from: "/matches/$neighbourhoodName" });
  const neighbourhoodName = decodeURIComponent(params.neighbourhoodName);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const callerPrincipal = identity?.getPrincipal().toString();

  const [postTab, setPostTab] = useState<PostTab>("spaces");
  const [filter, setFilter] = useState<SpaceFilter>("All");

  const {
    data: listings = [],
    isLoading: listingsLoading,
    isError: listingsError,
  } = useListingsByNeighbourhood(neighbourhoodName);

  const { data: pulses = [], isLoading: pulsesLoading } =
    usePulsesByNeighbourhood(neighbourhoodName);

  const deleteListingMutation = useDeleteListing();

  const handleDelete = async (id: bigint) => {
    try {
      await deleteListingMutation.mutateAsync(id);
      toast.success("Listing removed");
    } catch {
      toast.error("Failed to remove listing");
    }
  };

  const filteredListings =
    filter === "All"
      ? listings
      : listings.filter((l) => l.spaceType === filter);

  const insightPulses = pulses.filter((p) => p.category === "insights");
  const communityPulses = pulses.filter((p) => p.category === "community");

  const activeCount =
    postTab === "spaces"
      ? filteredListings.length
      : postTab === "insights"
        ? insightPulses.length
        : communityPulses.length;

  const isLoading = postTab === "spaces" ? listingsLoading : pulsesLoading;

  const subtitleLabel =
    postTab === "spaces"
      ? `${listings.length} space${listings.length !== 1 ? "s" : ""} listed`
      : postTab === "insights"
        ? `${insightPulses.length} insight${insightPulses.length !== 1 ? "s" : ""}`
        : `${communityPulses.length} post${communityPulses.length !== 1 ? "s" : ""}`;

  const POST_TABS: { id: PostTab; label: string }[] = [
    { id: "spaces", label: "Spaces" },
    { id: "insights", label: "Insights & Vibes" },
    { id: "community", label: "Community & Events" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => navigate({ to: "/matches" })}
              aria-label="Back to matches"
              data-ocid="listings.back_button"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold leading-tight">
                {neighbourhoodName}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Loading\u2026" : subtitleLabel}
              </p>
            </div>
            <Button
              size="sm"
              className="flex-shrink-0 text-xs"
              data-ocid="listings.post_button"
              onClick={() => navigate({ to: "/post" })}
            >
              + Post
            </Button>
          </div>
        </div>

        {/* Top-level post type tabs */}
        <div className="container mx-auto max-w-lg px-4 pb-3">
          <div
            className="flex gap-1.5"
            role="tablist"
            aria-label="Content type"
          >
            {POST_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={postTab === tab.id}
                data-ocid={`listings.${tab.id}.tab`}
                onClick={() => setPostTab(tab.id)}
                className={[
                  "flex flex-1 items-center justify-center rounded-full px-2 py-1.5 text-xs font-semibold transition-all duration-200",
                  postTab === tab.id
                    ? tab.id === "insights"
                      ? "bg-amber-500 text-white shadow-sm"
                      : tab.id === "community"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Space filter tabs — only when spaces tab active */}
      {postTab === "spaces" && (
        <div className="container mx-auto max-w-lg px-4 py-3">
          <div
            data-ocid="listings.filter.tab"
            className="flex gap-1.5 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {ALL_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto max-w-lg px-4 pb-24">
        {/* Loading skeleton */}
        {isLoading && (
          <div data-ocid="listings.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-5 w-2/3" />
                  <Skeleton className="mb-3 h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                  <div className="mt-3 flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && postTab === "spaces" && listingsError && (
          <div data-ocid="listings.error_state" className="py-12 text-center">
            <p className="text-sm text-destructive">
              Failed to load listings. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => navigate({ to: "/matches" })}
            >
              Go back
            </Button>
          </div>
        )}

        {/* ── SPACES TAB ── */}
        {!isLoading && postTab === "spaces" && !listingsError && (
          <>
            {filteredListings.length === 0 && (
              <div
                data-ocid="listings.empty_state"
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
                  🏘️
                </div>
                <h3 className="text-base font-semibold">
                  {filter === "All"
                    ? "No spaces listed here yet"
                    : `No ${FILTER_LABELS[filter]} spaces here yet`}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to post!
                </p>
                <Button
                  size="sm"
                  className="mt-4"
                  data-ocid="listings.post_button"
                  onClick={() => navigate({ to: "/post" })}
                >
                  Post a Space
                </Button>
              </div>
            )}

            {filteredListings.length > 0 && (
              <div className="space-y-3">
                {filteredListings.map((listing, idx) => {
                  const isOwner =
                    callerPrincipal &&
                    listing.postedBy.toString() === callerPrincipal;
                  return (
                    <Card
                      key={listing.id.toString()}
                      data-ocid={`listings.item.${idx + 1}`}
                      className="overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-bold leading-tight">
                                {listing.title}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${spaceTypeBadgeClass(
                                  listing.spaceType,
                                )}`}
                              >
                                {spaceTypeIcon(listing.spaceType)}
                                {listing.spaceType}
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-bold text-primary">
                              {formatPrice(listing)}
                            </p>
                          </div>
                          {isOwner && (
                            <Button
                              data-ocid={`listings.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 flex-shrink-0 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(listing.id)}
                              disabled={deleteListingMutation.isPending}
                              aria-label="Delete listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {listing.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Posted by{" "}
                            <span className="font-medium">
                              {isOwner
                                ? "You"
                                : truncatePrincipal(
                                    listing.postedBy.toString(),
                                  )}
                            </span>
                          </span>
                          {!isOwner && (
                            <a
                              href={buildWhatsAppUrl(
                                listing,
                                neighbourhoodName,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-ocid={`listings.enquire_button.${idx + 1}`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1.5 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 text-xs"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                Enquire
                              </Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── INSIGHTS TAB ── */}
        {!isLoading && postTab === "insights" && (
          <>
            {insightPulses.length === 0 && (
              <div
                data-ocid="listings.empty_state"
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl dark:bg-amber-900/20">
                  ✨
                </div>
                <h3 className="text-base font-semibold">
                  No insights shared yet
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share what you know about {neighbourhoodName}.
                </p>
                <Button
                  size="sm"
                  className="mt-4 bg-amber-500 text-white hover:bg-amber-600"
                  data-ocid="listings.post_button"
                  onClick={() => navigate({ to: "/post" })}
                >
                  Share an Insight
                </Button>
              </div>
            )}
            {insightPulses.length > 0 && (
              <div className="space-y-3">
                {insightPulses.map((pulse, idx) => (
                  <PulseCard
                    key={pulse.id.toString()}
                    pulse={pulse}
                    callerPrincipal={callerPrincipal}
                    index={idx + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── COMMUNITY TAB ── */}
        {!isLoading && postTab === "community" && (
          <>
            {communityPulses.length === 0 && (
              <div
                data-ocid="listings.empty_state"
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl dark:bg-emerald-900/20">
                  🌿
                </div>
                <h3 className="text-base font-semibold">
                  No community posts yet
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Post an event, gig, or community initiative in{" "}
                  {neighbourhoodName}.
                </p>
                <Button
                  size="sm"
                  className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
                  data-ocid="listings.post_button"
                  onClick={() => navigate({ to: "/post" })}
                >
                  Post to Community
                </Button>
              </div>
            )}
            {communityPulses.length > 0 && (
              <div className="space-y-3">
                {communityPulses.map((pulse, idx) => (
                  <PulseCard
                    key={pulse.id.toString()}
                    pulse={pulse}
                    callerPrincipal={callerPrincipal}
                    index={idx + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* count badge for active tab */}
        {!isLoading && activeCount > 0 && postTab !== "spaces" && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {activeCount} post{activeCount !== 1 ? "s" : ""} in{" "}
            {neighbourhoodName}
          </p>
        )}
      </div>
    </div>
  );
}
