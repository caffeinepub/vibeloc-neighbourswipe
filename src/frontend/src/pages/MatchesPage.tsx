import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import ShortlistList from "../components/shortlist/ShortlistList";
import { useShortlist } from "../hooks/useShortlist";

export default function MatchesPage() {
  const { shortlist, isLoading, removeFromShortlist } = useShortlist();
  const navigate = useNavigate();

  const handleRemove = async (id: number) => {
    try {
      await removeFromShortlist(id);
      toast.success("Removed from matches");
    } catch (error) {
      toast.error("Failed to remove from matches");
      console.error(error);
    }
  };

  const handleNavigate = (name: string) => {
    navigate({
      to: "/matches/$neighbourhoodName",
      params: { neighbourhoodName: encodeURIComponent(name) },
    });
  };

  if (isLoading) {
    return (
      <div
        data-ocid="matches.loading_state"
        className="flex min-h-[calc(100vh-8rem)] items-center justify-center"
      >
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-border bg-background py-5">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="text-2xl font-bold">Your Matches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {shortlist.length}{" "}
            {shortlist.length === 1 ? "neighbourhood" : "neighbourhoods"} liked
            · tap to see available spaces
          </p>
        </div>
      </div>
      <ShortlistList
        neighbourhoods={shortlist}
        onRemove={handleRemove}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
