import { toast } from "sonner";
import ShortlistList from "../components/shortlist/ShortlistList";
import { useShortlist } from "../hooks/useShortlist";

export default function ShortlistPage() {
  const { shortlist, isLoading, removeFromShortlist } = useShortlist();

  const handleRemove = async (id: number) => {
    try {
      await removeFromShortlist(id);
      toast.success("Removed from shortlist");
    } catch (error) {
      toast.error("Failed to remove from shortlist");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading shortlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-border bg-background py-6">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="text-2xl font-bold">Your Shortlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {shortlist.length}{" "}
            {shortlist.length === 1 ? "neighbourhood" : "neighbourhoods"} saved
          </p>
        </div>
      </div>
      <ShortlistList neighbourhoods={shortlist} onRemove={handleRemove} />
    </div>
  );
}
