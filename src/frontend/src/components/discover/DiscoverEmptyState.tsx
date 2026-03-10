import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { RefreshCw, Settings } from "lucide-react";

interface DiscoverEmptyStateProps {
  onReset: () => void;
}

export default function DiscoverEmptyState({
  onReset,
}: DiscoverEmptyStateProps) {
  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <Card>
        <CardContent className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <RefreshCw className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              You've seen all neighbourhoods!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You've reviewed all available neighbourhoods. Adjust your
              preferences or reset to see them again.
            </p>
          </div>
          <div className="space-y-3">
            <Button onClick={onReset} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset Swipes
            </Button>
            <Link to="/profile">
              <Button variant="outline" className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Adjust Preferences
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
