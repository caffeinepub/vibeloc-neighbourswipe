import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin, Zap } from "lucide-react";
import { useState } from "react";
import type { PulsePost } from "../backend";
import { useActor } from "../hooks/useActor";
import { useShortlist } from "../hooks/useShortlist";

function timeAgo(createdAt: bigint): string {
  const nowMs = Date.now();
  const createdMs = Number(createdAt / 1_000_000n);
  const diffMs = nowMs - createdMs;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

type FilterType = "all" | "Insights & Vibes" | "Community & Events";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Insights & Vibes", value: "Insights & Vibes" },
  { label: "Community & Events", value: "Community & Events" },
];

function categoryStyle(category: string): string {
  if (category === "Insights & Vibes")
    return "bg-amber-100 text-amber-800 border-amber-200";
  if (category === "Community & Events")
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  return "bg-muted text-muted-foreground";
}

function PulseCardSkeleton() {
  return (
    <Card className="border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  );
}

function PulseCard({ pulse }: { pulse: PulsePost }) {
  return (
    <Card
      className="border-border hover:border-primary/40 transition-colors"
      data-ocid="pulses.item"
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {pulse.neighbourhood}
          </span>
          <Badge
            variant="outline"
            className={`text-xs ${categoryStyle(pulse.category)}`}
          >
            {pulse.category}
          </Badge>
        </div>

        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {pulse.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {pulse.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground/70">
            {pulse.postType}
          </span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(pulse.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PulsesPage() {
  const { shortlist, isLoading: shortlistLoading } = useShortlist();
  const { actor, isFetching: actorFetching } = useActor();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const shortlistNames = new Set(shortlist.map((n) => n.name));

  const { data: allPulses = [], isLoading: pulsesLoading } = useQuery<
    PulsePost[]
  >({
    queryKey: ["pulses", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPulses();
    },
    enabled: !!actor && !actorFetching,
  });

  const isLoading = shortlistLoading || pulsesLoading || actorFetching;

  const filteredPulses = allPulses
    .filter((p) => shortlistNames.has(p.neighbourhood))
    .filter((p) => activeFilter === "all" || p.category === activeFilter)
    .sort((a, b) => Number(b.createdAt - a.createdAt));

  const hasMatches = shortlist.length > 0;

  return (
    <div className="flex flex-col min-h-full pb-20" data-ocid="pulses.page">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">Pulses</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Activity from your matched neighbourhoods
        </p>

        {/* Filter pills */}
        <div
          className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide"
          data-ocid="pulses.filter.tab"
        >
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              data-ocid={`pulses.${f.value.replace(/ & /g, "_").toLowerCase()}.tab`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {isLoading ? (
          <>
            <PulseCardSkeleton />
            <PulseCardSkeleton />
            <PulseCardSkeleton />
          </>
        ) : !hasMatches ? (
          <div
            className="flex flex-col items-center justify-center text-center py-16 gap-4"
            data-ocid="pulses.empty_state"
          >
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Zap className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                No matched neighbourhoods yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Discover and like neighbourhoods to see their Pulses here.
              </p>
            </div>
            <Link to="/">
              <Button size="sm" data-ocid="pulses.discover_button">
                Start Discovering
              </Button>
            </Link>
          </div>
        ) : filteredPulses.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center py-16 gap-4"
            data-ocid="pulses.empty_state"
          >
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Zap className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm">No pulses yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                No activity in your matched neighbourhoods yet. Be the first to
                post!
              </p>
            </div>
            <Link to="/post">
              <Button
                size="sm"
                variant="outline"
                data-ocid="pulses.post_button"
              >
                Post a Pulse
              </Button>
            </Link>
          </div>
        ) : (
          filteredPulses.map((pulse) => (
            <PulseCard key={String(pulse.id)} pulse={pulse} />
          ))
        )}
      </div>
    </div>
  );
}
