import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Neighbourhood } from "../../types/neighbourhood";

interface NeighbourhoodCardProps {
  neighbourhood: Neighbourhood;
}

export default function NeighbourhoodCard({
  neighbourhood,
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-3xl font-bold">{neighbourhood.name}</h3>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{neighbourhood.commuteNote}</span>
          </div>
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold text-primary">
            KES {neighbourhood.rentMin.toLocaleString()} -{" "}
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
