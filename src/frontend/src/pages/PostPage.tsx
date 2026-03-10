import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NAIROBI_NEIGHBOURHOODS } from "../data/neighbourhoodCatalog";
import { usePostSpaceListing } from "../hooks/useQueries";

const SPACE_TYPES = [
  { value: "Airbnb", label: "🏠 Airbnb / Short-stay", priceUnit: "/night" },
  { value: "Rental", label: "🔑 Long-term Rental", priceUnit: "/month" },
  { value: "Commercial", label: "🏢 Commercial Space", priceUnit: "/month" },
  {
    value: "Student Housing",
    label: "🎓 Student Housing",
    priceUnit: "/month",
  },
  { value: "Co-living", label: "🤝 Shared / Co-living", priceUnit: "/month" },
  {
    value: "Co-working",
    label: "💼 Office / Co-working",
    priceUnit: "/desk/month",
  },
  { value: "Land", label: "🌱 Land / Plot", priceUnit: "/plot" },
] as const;

const MAX_DESCRIPTION = 500;

export default function PostPage() {
  const navigate = useNavigate();
  const postListingMutation = usePostSpaceListing();

  const [title, setTitle] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedType = SPACE_TYPES.find((t) => t.value === spaceType);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!neighbourhood) errs.neighbourhood = "Please select a neighbourhood";
    if (!spaceType) errs.spaceType = "Please select a space type";
    if (!price || Number(price) <= 0)
      errs.price = "Please enter a valid price greater than 0";
    if (!description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      await postListingMutation.mutateAsync({
        title: title.trim(),
        neighbourhood,
        spaceType,
        price: BigInt(Math.round(Number(price))),
        description: description.trim(),
      });
      toast.success("Listing posted! 🎉");
      navigate({ to: "/matches" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to post listing. Please try again.");
    }
  };

  const isPending = postListingMutation.isPending;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-background py-5">
        <div className="container mx-auto max-w-lg px-4">
          <h1 className="text-2xl font-bold">Post a Space</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            List your property for renters, Airbnb guests, students, co-workers,
            or commercial tenants
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-lg px-4 py-6 pb-28">
        <form onSubmit={handleSubmit} noValidate>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="post-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="post-title"
                  data-ocid="post.title_input"
                  placeholder="e.g. Cosy 1BR near Westgate Mall"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  disabled={isPending}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p
                    data-ocid="post.title_error"
                    className="text-xs text-destructive"
                  >
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Neighbourhood */}
              <div className="space-y-1.5">
                <Label htmlFor="post-neighbourhood">
                  Neighbourhood <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={neighbourhood}
                  onValueChange={(v) => {
                    setNeighbourhood(v);
                    if (errors.neighbourhood)
                      setErrors((prev) => ({ ...prev, neighbourhood: "" }));
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="post-neighbourhood"
                    data-ocid="post.neighbourhood_select"
                    className={errors.neighbourhood ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a neighbourhood" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {NAIROBI_NEIGHBOURHOODS.map((n) => (
                      <SelectItem key={n.id} value={n.name}>
                        {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.neighbourhood && (
                  <p
                    data-ocid="post.neighbourhood_error"
                    className="text-xs text-destructive"
                  >
                    {errors.neighbourhood}
                  </p>
                )}
              </div>

              {/* Space Type */}
              <div className="space-y-1.5">
                <Label htmlFor="post-space-type">
                  Space Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={spaceType}
                  onValueChange={(v) => {
                    setSpaceType(v);
                    if (errors.spaceType)
                      setErrors((prev) => ({ ...prev, spaceType: "" }));
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="post-space-type"
                    data-ocid="post.type_select"
                    className={errors.spaceType ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a space type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPACE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.spaceType && (
                  <p
                    data-ocid="post.type_error"
                    className="text-xs text-destructive"
                  >
                    {errors.spaceType}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="post-price">
                  Price (KES){" "}
                  {selectedType && (
                    <span className="text-muted-foreground text-xs font-normal">
                      {selectedType.priceUnit}
                    </span>
                  )}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    KES
                  </span>
                  <Input
                    id="post-price"
                    data-ocid="post.price_input"
                    type="number"
                    min="1"
                    step="500"
                    placeholder="e.g. 25000"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price)
                        setErrors((prev) => ({ ...prev, price: "" }));
                    }}
                    disabled={isPending}
                    className={`pl-12 ${errors.price ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.price && (
                  <p
                    data-ocid="post.price_error"
                    className="text-xs text-destructive"
                  >
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <span
                    className={`text-xs ${
                      description.length > MAX_DESCRIPTION
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {description.length}/{MAX_DESCRIPTION}
                  </span>
                </div>
                <Textarea
                  id="post-description"
                  data-ocid="post.description_textarea"
                  placeholder="Describe the space — size, amenities, what makes it great…"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_DESCRIPTION) {
                      setDescription(e.target.value);
                    }
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  disabled={isPending}
                  className={`resize-none ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && (
                  <p
                    data-ocid="post.description_error"
                    className="text-xs text-destructive"
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                data-ocid="post.submit_button"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting…
                  </>
                ) : (
                  "Post Space Listing"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
