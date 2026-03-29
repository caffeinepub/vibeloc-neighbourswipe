import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { Neighbourhood } from "../../types/neighbourhood";

interface NeighbourhoodCardProps {
  neighbourhood: Neighbourhood;
  matchReasons?: string[];
  onLearnMore?: () => void;
}

export default function NeighbourhoodCard({
  neighbourhood,
  matchReasons,
  onLearnMore,
}: NeighbourhoodCardProps) {
  const imageUrl = neighbourhood.imageFilename;
  const isDigital = neighbourhood.isDigitalCity;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset loaded state when the image URL changes (i.e. new card is shown)
  // biome-ignore lint/correctness/useExhaustiveDependencies: imageUrl is intentional — reset on card change
  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  // Build the full list of tags to show at the top, including digital city label
  const topTags = [
    ...(isDigital ? ["🏙️ Smart Cities"] : []),
    ...(matchReasons ?? []).slice(0, 2).map((r) => `✦ ${r}`),
  ];

  return (
    <Card
      className={`overflow-hidden ${
        isDigital
          ? "border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
          : "border-2"
      }`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* Placeholder shown while image loads */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />

        <img
          src={imageUrl}
          alt={neighbourhood.name}
          loading="eager"
          // @ts-ignore fetchPriority is a valid HTML attribute
          fetchPriority="high"
          decoding="async"
          style={{ willChange: "opacity" }}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {topTags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {topTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3 className="text-3xl font-bold leading-tight">
            {neighbourhood.name}
          </h3>
          {neighbourhood.vibeSummary && (
            <p className="mt-1 text-sm italic text-white/85 leading-snug">
              {neighbourhood.vibeSummary}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-white/70">
              {isDigital ? (
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <MapPin className="h-3.5 w-3.5" />
              )}
              <span>{neighbourhood.commuteNote}</span>
            </div>
            {onLearnMore && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 rounded-full bg-white/15 px-3 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onLearnMore();
                }}
                data-ocid="neighbourhood.learnmore.button"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                {isDigital ? "Explore" : "Learn More"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <div>
          {isDigital ? (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              🌱 Open Community · No rent listed
            </p>
          ) : (
            <p className="text-sm font-semibold text-primary">
              KES {neighbourhood.rentMin.toLocaleString()} &mdash;{" "}
              {neighbourhood.rentMax.toLocaleString()}/month
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {neighbourhood.description}
          </p>
          {isDigital && (
            <p className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
              ✦ Powered by Dewellpunk culture — decentralized, wellness-focused,
              and unapologetically alternative
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {neighbourhood.tags.slice(0, 5).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`capitalize ${
                isDigital &&
                [
                  "digital-city",
                  "dewellpunk",
                  "creative",
                  "innovation",
                ].includes(tag)
                  ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : ""
              }`}
            >
              {tag === "digital-city" ? "pop up cities" : tag.replace("-", " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
