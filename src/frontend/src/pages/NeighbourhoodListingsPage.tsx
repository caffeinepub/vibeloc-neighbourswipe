import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Home,
  Laptop,
  Leaf,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SpaceListing } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteListing,
  useListingsByNeighbourhood,
} from "../hooks/useQueries";

type SpaceFilter =
  | "All"
  | "Airbnb"
  | "Rental"
  | "Commercial"
  | "Student Housing"
  | "Co-living"
  | "Co-working"
  | "Land";

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

export default function NeighbourhoodListingsPage() {
  const params = useParams({ from: "/matches/$neighbourhoodName" });
  const neighbourhoodName = decodeURIComponent(params.neighbourhoodName);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const callerPrincipal = identity?.getPrincipal().toString();

  const [filter, setFilter] = useState<SpaceFilter>("All");

  const {
    data: listings = [],
    isLoading,
    isError,
  } = useListingsByNeighbourhood(neighbourhoodName);

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

  const truncatePrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 6)}\u2026${principal.slice(-4)}`;
  };

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
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold leading-tight">
                {neighbourhoodName}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "Loading spaces\u2026"
                  : `${listings.length} space${
                      listings.length !== 1 ? "s" : ""
                    } listed`}
              </p>
            </div>
            <Button
              size="sm"
              className="flex-shrink-0 text-xs"
              onClick={() => navigate({ to: "/post" })}
            >
              + Post Space
            </Button>
          </div>
        </div>
      </div>

      {/* Filter tabs - scrollable pill row for all 8 options */}
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

      {/* Content */}
      <div className="container mx-auto max-w-lg px-4 pb-24">
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

        {isError && (
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

        {!isLoading && !isError && filteredListings.length === 0 && (
          <div data-ocid="listings.empty_state" className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
              \uD83C\uDFD8\uFE0F
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
              onClick={() => navigate({ to: "/post" })}
            >
              Post a Space
            </Button>
          </div>
        )}

        {!isLoading && !isError && filteredListings.length > 0 && (
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
                            : truncatePrincipal(listing.postedBy.toString())}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
