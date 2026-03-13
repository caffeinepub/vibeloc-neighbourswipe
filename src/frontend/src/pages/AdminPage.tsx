import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Check,
  CheckCircle2,
  ClipboardCopy,
  GraduationCap,
  Home,
  Laptop,
  Leaf,
  Loader2,
  MapPin,
  MessageCircle,
  Shield,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SpaceListing } from "../backend";
import { useAdminListings, useIsAdmin } from "../hooks/useAdmin";
import { useShortlist } from "../hooks/useShortlist";

const WHATSAPP_KEY = "vibeloc_whatsapp_number";
const VERIFIED_KEY = "vibeloc_verified_listings";

function getStoredWhatsApp(): string {
  return localStorage.getItem(WHATSAPP_KEY) || "+254700000000";
}

function getVerifiedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VERIFIED_KEY) || "[]");
  } catch {
    return [];
  }
}

function setVerifiedIds(ids: string[]) {
  localStorage.setItem(VERIFIED_KEY, JSON.stringify(ids));
}

function spaceTypeBadgeClass(spaceType: string): string {
  switch (spaceType) {
    case "Airbnb":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Rental":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Commercial":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Student Housing":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Co-living":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "Co-working":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Land":
      return "bg-lime-100 text-lime-800 border-lime-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function spaceTypeIcon(spaceType: string) {
  switch (spaceType) {
    case "Airbnb":
      return <Home className="h-3 w-3" />;
    case "Rental":
      return <MapPin className="h-3 w-3" />;
    case "Commercial":
      return <Building2 className="h-3 w-3" />;
    case "Student Housing":
      return <GraduationCap className="h-3 w-3" />;
    case "Co-living":
      return <Users className="h-3 w-3" />;
    case "Co-working":
      return <Laptop className="h-3 w-3" />;
    case "Land":
      return <Leaf className="h-3 w-3" />;
    default:
      return null;
  }
}

function truncatePrincipal(p: string) {
  if (p.length <= 12) return p;
  return `${p.slice(0, 6)}\u2026${p.slice(-4)}`;
}

function formatDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab({
  listings,
  verifiedIds,
  shortlistCount,
}: {
  listings: SpaceListing[];
  verifiedIds: string[];
  shortlistCount: number;
}) {
  const stats = [
    {
      label: "Total Listings",
      value: listings.length,
      icon: <Building2 className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      label: "Verified by VibeLoc",
      value: verifiedIds.length,
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "text-emerald-600",
    },
    {
      label: "Total Matches",
      value: shortlistCount,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-primary",
    },
    {
      label: "Unique Posters",
      value: new Set(listings.map((l) => l.postedBy.toString())).size,
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
    },
  ];

  return (
    <div data-ocid="admin.stats.panel" className="grid grid-cols-2 gap-3 p-4">
      {stats.map((s) => (
        <Card key={s.label} className="overflow-hidden">
          <CardContent className="p-4">
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-bold tabular-nums">{s.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {s.label}
            </div>
          </CardContent>
        </Card>
      ))}
      <Card className="col-span-2 border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800">
            All enquiries are routed through the VibeLoc WhatsApp bridge for
            verification. Update the number in the{" "}
            <span className="font-semibold">WhatsApp Bridge</span> tab.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Listings Tab ─────────────────────────────────────────────────────────────
function ListingsTab({
  listings,
  verifiedIds,
  onToggleVerified,
  onDelete,
  isDeleting,
}: {
  listings: SpaceListing[];
  verifiedIds: string[];
  onToggleVerified: (id: string) => void;
  onDelete: (id: bigint) => Promise<void>;
  isDeleting: boolean;
}) {
  if (listings.length === 0) {
    return (
      <div data-ocid="admin.listings.empty_state" className="py-16 text-center">
        <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No listings posted yet</p>
      </div>
    );
  }

  return (
    <div data-ocid="admin.listings.list" className="divide-y divide-border">
      {listings.map((listing, idx) => {
        const idStr = listing.id.toString();
        const isVerified = verifiedIds.includes(idStr);
        return (
          <div
            key={idStr}
            data-ocid={`admin.listings.item.${idx + 1}`}
            className="flex items-start gap-3 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-sm font-semibold">
                  {listing.title}
                </span>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Check className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${spaceTypeBadgeClass(listing.spaceType)}`}
                >
                  {spaceTypeIcon(listing.spaceType)}
                  {listing.spaceType}
                </span>
                <span className="text-xs font-medium text-primary">
                  KES {Number(listing.price).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{listing.neighbourhood}</span>
                <span>·</span>
                <span>{truncatePrincipal(listing.postedBy.toString())}</span>
                <span>·</span>
                <span>{formatDate(listing.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
              <button
                type="button"
                data-ocid={`admin.listings.toggle.${idx + 1}`}
                onClick={() => onToggleVerified(idStr)}
                className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium transition-colors ${
                  isVerified
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-border bg-background text-muted-foreground hover:border-emerald-300 hover:text-emerald-600"
                }`}
                aria-label={
                  isVerified ? "Remove verification" : "Mark as verified"
                }
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isVerified ? "Verified" : "Verify"}
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    data-ocid={`admin.listings.delete_button.${idx + 1}`}
                    className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                    aria-label="Delete listing"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="admin.listings.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      &ldquo;{listing.title}&rdquo; will be permanently removed.
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="admin.listings.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      data-ocid="admin.listings.confirm_button"
                      disabled={isDeleting}
                      onClick={() => onDelete(listing.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ listings }: { listings: SpaceListing[] }) {
  const usersMap = new Map<string, number>();
  for (const l of listings) {
    const p = l.postedBy.toString();
    usersMap.set(p, (usersMap.get(p) ?? 0) + 1);
  }
  const users = Array.from(usersMap.entries()).sort((a, b) => b[1] - a[1]);

  if (users.length === 0) {
    return (
      <div data-ocid="admin.users.empty_state" className="py-16 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No users with listings yet
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="admin.users.list" className="divide-y divide-border">
      {users.map(([principal, count], idx) => (
        <div
          key={principal}
          data-ocid={`admin.users.item.${idx + 1}`}
          className="flex items-center gap-3 px-4 py-3"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {idx + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-medium">
              {truncatePrincipal(principal)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {count} listing{count !== 1 ? "s" : ""} posted
            </p>
          </div>
          <Badge variant="secondary" className="flex-shrink-0 tabular-nums">
            {count}
          </Badge>
        </div>
      ))}
    </div>
  );
}

// ─── WhatsApp Bridge Tab ──────────────────────────────────────────────────────
function WhatsAppBridgeTab() {
  const [number, setNumber] = useState(getStoredWhatsApp);
  const [saved, setSaved] = useState(getStoredWhatsApp);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const trimmed = number.trim();
    if (!trimmed) {
      toast.error("Please enter a valid WhatsApp number");
      return;
    }
    localStorage.setItem(WHATSAPP_KEY, trimmed);
    setSaved(trimmed);
    toast.success("WhatsApp number updated");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(saved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div data-ocid="admin.whatsapp.panel" className="space-y-5 p-4">
      {/* Active number display */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm text-green-800">
            <MessageCircle className="h-4 w-4" />
            Active Enquiry Number
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center gap-2">
            <span className="flex-1 font-mono text-lg font-bold text-green-900">
              {saved}
            </span>
            <Button
              data-ocid="admin.whatsapp.copy_button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 border-green-300 text-green-700 hover:bg-green-100"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <ClipboardCopy className="h-3.5 w-3.5" />
              )}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
          <p className="mt-2 text-xs text-green-700">
            This number appears on all listing enquiry buttons across VibeLoc.
          </p>
        </CardContent>
      </Card>

      {/* Edit number */}
      <div className="space-y-3">
        <Label htmlFor="whatsapp-input" className="text-sm font-semibold">
          Update WhatsApp Business Number
        </Label>
        <div className="flex gap-2">
          <Input
            id="whatsapp-input"
            data-ocid="admin.whatsapp.input"
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="+254700000000"
            className="font-mono"
          />
          <Button
            data-ocid="admin.whatsapp.save_button"
            onClick={handleSave}
            className="flex-shrink-0"
          >
            Save
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Include the country code (e.g. <span className="font-mono">+254</span>{" "}
          for Kenya). Changes take effect immediately — no rebuild needed.
        </p>
      </div>

      {/* Info box */}
      <Card className="border-border bg-muted/40">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="text-xs font-semibold">
                How the WhatsApp Bridge works
              </p>
              <p className="text-xs text-muted-foreground">
                When a renter taps &ldquo;Enquire&rdquo; on any listing, they
                are routed to this number with a pre-filled message containing
                the listing details. Your team verifies the listing and connects
                the parties — protecting both sides from scams.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { listings, isLoading, isError, deleteListing, isDeleting } =
    useAdminListings();
  const { shortlist } = useShortlist();

  const [verifiedIds, setVerifiedIdsState] = useState<string[]>(getVerifiedIds);

  useEffect(() => {
    setVerifiedIds(verifiedIds);
  }, [verifiedIds]);

  const handleToggleVerified = (id: string) => {
    setVerifiedIdsState((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteListing(id);
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  if (adminLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex min-h-[calc(100vh-8rem)] items-center justify-center"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.error_state"
        className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Shield className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold">Admin Access Required</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          You need to be logged in as an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">
                VibeLoc · Moderation &amp; Control
              </p>
            </div>
            <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stats" className="w-full">
        <div className="sticky top-[69px] z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto max-w-lg">
            <TabsList
              data-ocid="admin.tabs"
              className="h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0"
            >
              {[
                { value: "stats", label: "Stats" },
                { value: "listings", label: "Listings" },
                { value: "users", label: "Users" },
                { value: "whatsapp", label: "WhatsApp" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  data-ocid={`admin.${tab.value}.tab`}
                  className="flex-1 rounded-none border-b-2 border-transparent px-3 py-3 text-xs font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  {tab.label}
                  {tab.value === "listings" && listings.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                      {listings.length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="container mx-auto max-w-lg pb-24">
          <TabsContent value="stats" className="mt-0">
            <StatsTab
              listings={listings}
              verifiedIds={verifiedIds}
              shortlistCount={shortlist.length}
            />
          </TabsContent>

          <TabsContent value="listings" className="mt-0">
            {isLoading ? (
              <div
                data-ocid="admin.listings.loading_state"
                className="space-y-0 divide-y divide-border"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div
                data-ocid="admin.listings.error_state"
                className="py-12 text-center"
              >
                <p className="text-sm text-destructive">
                  Failed to load listings.
                </p>
              </div>
            ) : (
              <ListingsTab
                listings={listings}
                verifiedIds={verifiedIds}
                onToggleVerified={handleToggleVerified}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            {isLoading ? (
              <div
                data-ocid="admin.users.loading_state"
                className="space-y-0 divide-y divide-border"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <UsersTab listings={listings} />
            )}
          </TabsContent>

          <TabsContent value="whatsapp" className="mt-0">
            <WhatsAppBridgeTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
