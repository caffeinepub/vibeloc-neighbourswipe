import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, MapPin } from "lucide-react";
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
  const imageUrl = `/assets/generated/${neighbourhood.imageFilename}`;

  return (
    <Card className="overflow-hidden border-2">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={neighbourhood.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {matchReasons && matchReasons.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {matchReasons.slice(0, 2).map((reason) => (
                <span
                  key={reason}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  ✦ {reason}
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
              <MapPin className="h-3.5 w-3.5" />
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
                Learn More
              </Button>
            )}
          </div>
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold text-primary">
            KES {neighbourhood.rentMin.toLocaleString()} &mdash;{" "}
            {neighbourhood.rentMax.toLocaleString()}/month
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {neighbourhood.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {neighbourhood.tags.slice(0, 5).map((tag) => (
            <Badge key={tag} variant="secondary" className="capitalize">
              {tag.replace("-", " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
