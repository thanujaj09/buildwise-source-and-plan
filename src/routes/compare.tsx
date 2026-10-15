import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, PackageCheck, PackageX, Star, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inr, materialById, materials, offersFor } from "@/lib/data";

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>): { material?: string } =>
    typeof search["material"] === "string" ? { material: search["material"] } : {},
  head: () => ({
    meta: [
      { title: "Supplier Comparison — BuildWise AI" },
      {
        name: "description",
        content:
          "Compare fictional suppliers side by side: demo price, lead time, rating, minimum order and stock status for any material.",
      },
      { property: "og:title", content: "Supplier Comparison — BuildWise AI" },
      {
        property: "og:description",
        content: "Line up demo offers from five fictional suppliers and spot the best deal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { material } = Route.useSearch();
  const navigate = useNavigate();
  const selected = materialById(material);
  const offers = offersFor(selected.id);
  const best = offers[0] as (typeof offers)[number];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
        Demo prices · fictional suppliers
      </Badge>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Supplier Comparison
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Pick a material to see offers from all five fictional suppliers, sorted by demo price.
      </p>

      <div className="mt-6 max-w-md">
        <Select
          value={selected.id}
          onValueChange={(value) => navigate({ to: "/compare", search: { material: value } })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a material" />
          </SelectTrigger>
          <SelectContent>
            {materials.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{selected.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selected.category} · priced {selected.unit}
          </p>
        </div>
        {best && (
          <Badge className="ml-auto gap-1" variant="default">
            <BadgeCheck className="h-3.5 w-3.5" />
            Best demo price {inr(best.price)}
          </Badge>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer, i) => {
          const isBest = i === 0;
          return (
            <Card
              key={offer.supplier.id}
              className={
                isBest
                  ? "border-primary/70 shadow-glow"
                  : "transition-colors hover:border-primary/40"
              }
            >
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{offer.supplier.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {offer.supplier.location}
                    </p>
                  </div>
                  {isBest ? (
                    <Badge>Best price</Badge>
                  ) : (
                    <Badge variant="secondary">+{inr(offer.price - best.price)}</Badge>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Demo price · {selected.unit}</p>
                  <p className="font-display text-3xl font-bold text-primary">
                    {inr(offer.price)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    {offer.supplier.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    {offer.leadTimeDays} days
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {offer.inStock ? (
                      <>
                        <PackageCheck className="h-4 w-4 text-primary" /> In stock
                      </>
                    ) : (
                      <>
                        <PackageX className="h-4 w-4 text-destructive" /> Backorder
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Min. order value {inr(offer.supplier.minOrder)} · demo terms
                </p>

                <Button asChild className="mt-auto" variant={isBest ? "default" : "outline"}>
                  <Link to="/enquiry" search={{ material: selected.id }}>
                    Enquire with {offer.supplier.name.split(" ")[0]}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
