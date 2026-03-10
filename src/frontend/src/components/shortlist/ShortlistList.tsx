import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, MapPin, X } from "lucide-react";
import type { Neighbourhood } from "../../types/neighbourhood";

interface ShortlistListProps {
  neighbourhoods: Neighbourhood[];
  onRemove: (id: number) => void;
  onNavigate?: (name: string) => void;
}

export default function ShortlistList({
  neighbourhoods,
  onRemove,
  onNavigate,
}: ShortlistListProps) {
  if (neighbourhoods.length === 0) {
    return (
      <div
        data-ocid="matches.empty_state"
        className="container mx-auto max-w-md px-4 py-12 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-4xl">💚</span>
        </div>
        <h3 className="mt-6 text-xl font-bold">No matches yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No matches yet — start swiping to find your vibe!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-3 px-4 py-6">
      {neighbourhoods.map((neighbourhood, idx) => (
        <Card
          key={neighbourhood.id}
          data-ocid={`matches.item.${idx + 1}`}
          className="overflow-hidden transition-shadow hover:shadow-md"
        >
          <div className="flex">
            <button
              type="button"
              className="relative h-28 w-28 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onNavigate?.(neighbourhood.name)}
              aria-label={`View listings in ${neighbourhood.name}`}
            >
              <img
                src={`/assets/generated/${neighbourhood.imageFilename}`}
                alt={neighbourhood.name}
                className="h-full w-full object-cover"
              />
            </button>
            <CardContent className="flex flex-1 flex-col justify-between p-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    className="flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    onClick={() => onNavigate?.(neighbourhood.name)}
                  >
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold leading-tight">
                        {neighbourhood.name}
                      </h3>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 flex-shrink-0 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(neighbourhood.id)}
                    aria-label={`Remove ${neighbourhood.name} from matches`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-primary">
                  KES {neighbourhood.rentMin.toLocaleString()} –{" "}
                  {neighbourhood.rentMax.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {neighbourhood.commuteNote}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {neighbourhood.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs capitalize"
                  >
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
