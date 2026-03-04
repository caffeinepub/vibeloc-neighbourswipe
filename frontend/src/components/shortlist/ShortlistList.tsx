import { Neighbourhood } from '../../types/neighbourhood';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin } from 'lucide-react';

interface ShortlistListProps {
  neighbourhoods: Neighbourhood[];
  onRemove: (id: number) => void;
}

export default function ShortlistList({ neighbourhoods, onRemove }: ShortlistListProps) {
  if (neighbourhoods.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-4xl">💚</span>
        </div>
        <h3 className="mt-6 text-xl font-bold">No saved neighbourhoods yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start swiping to find neighbourhoods you love!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-4 px-4 py-6">
      {neighbourhoods.map((neighbourhood) => (
        <Card key={neighbourhood.id} className="overflow-hidden">
          <div className="flex">
            <div className="relative h-32 w-32 flex-shrink-0">
              <img
                src={`/assets/generated/${neighbourhood.imageFilename}`}
                alt={neighbourhood.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold">{neighbourhood.name}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(neighbourhood.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-xs font-semibold text-primary">
                  KES {neighbourhood.rentMin.toLocaleString()} - {neighbourhood.rentMax.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{neighbourhood.commuteNote}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {neighbourhood.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize">
                    {tag.replace('-', ' ')}
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
