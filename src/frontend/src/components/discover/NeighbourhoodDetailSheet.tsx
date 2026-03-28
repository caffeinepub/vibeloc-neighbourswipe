import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bus, ExternalLink, MapPin, Share2, Train } from "lucide-react";
import { toast } from "sonner";
import type { Neighbourhood } from "../../types/neighbourhood";
import { slugify } from "../../utils/slugify";

interface NeighbourhoodDetailSheetProps {
  neighbourhood: Neighbourhood;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NeighbourhoodDetailSheet({
  neighbourhood,
  open,
  onOpenChange,
}: NeighbourhoodDetailSheetProps) {
  const { lat, lng } = neighbourhood;
  const bbox = `${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const mapHref = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;

  async function handleShare() {
    const slug = slugify(neighbourhood.name);
    const url = `${window.location.origin}${window.location.pathname}?hood=${slug}`;
    const title = `${neighbourhood.name} | VibeLoc by GJilani`;
    const text = `Check out ${neighbourhood.name} on VibeLoc — ${neighbourhood.vibeSummary}. Match your vibe 📍`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied! Share it on WhatsApp or social media.");
      } catch {
        toast.error("Could not copy link. Try again.");
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl p-0"
        data-ocid="neighbourhood.detail.sheet"
      >
        <ScrollArea className="h-full">
          {/* Map Section */}
          <div className="relative w-full" style={{ height: 220 }}>
            <iframe
              src={mapSrc}
              title={`${neighbourhood.name} map`}
              className="h-full w-full rounded-t-2xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 right-2">
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs text-white/90 backdrop-blur-sm hover:bg-black/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                View larger map
              </a>
            </div>
          </div>

          <div className="space-y-5 p-5">
            {/* Header */}
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-2xl font-bold leading-tight">
                {neighbourhood.name}
              </SheetTitle>
              {neighbourhood.vibeSummary && (
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  &ldquo;{neighbourhood.vibeSummary}&rdquo;
                </p>
              )}
            </SheetHeader>

            {/* Rent Range */}
            <div className="rounded-xl bg-primary/10 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Monthly Rent
              </p>
              <p className="mt-0.5 text-xl font-bold text-primary">
                KES {neighbourhood.rentMin.toLocaleString()} &mdash;{" "}
                {neighbourhood.rentMax.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {neighbourhood.commuteNote}
              </p>
            </div>

            {/* Landmarks */}
            <div>
              <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Nearby Landmarks
              </h3>
              <ul className="space-y-1.5">
                {neighbourhood.landmarks.map((landmark) => (
                  <li
                    key={landmark}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    {landmark}
                  </li>
                ))}
              </ul>
            </div>

            {/* Transport Options */}
            <div>
              <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                <Bus className="h-4 w-4 text-primary" />
                Getting Around
              </h3>
              <ul className="space-y-1.5">
                {neighbourhood.transportOptions.map((option) => (
                  <li
                    key={option}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Train className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/50" />
                    {option}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h3 className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-foreground">
                Vibe Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {neighbourhood.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="pt-1">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleShare}
                data-ocid="neighbourhood.share.button"
              >
                <Share2 className="h-4 w-4" />
                Share this neighbourhood
              </Button>
            </div>

            {/* Bottom padding for safe area */}
            <div className="h-6" />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
