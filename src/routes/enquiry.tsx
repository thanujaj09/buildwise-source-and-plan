import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { inr, materialById, materials, suppliers } from "@/lib/data";

export const Route = createFileRoute("/enquiry")({
  validateSearch: (search: Record<string, unknown>): { material?: string } =>
    typeof search["material"] === "string" ? { material: search["material"] } : {},
  head: () => ({
    meta: [
      { title: "Order Enquiry — BuildWise AI" },
      {
        name: "description",
        content:
          "Raise a structured purchase enquiry for construction materials and receive a demo reference number instantly.",
      },
      { property: "og:title", content: "Order Enquiry — BuildWise AI" },
      {
        property: "og:description",
        content: "Send a demo purchase enquiry to fictional suppliers and get a reference number.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnquiryPage,
});

const cities = ["Mumbai", "Pune", "Nashik", "Nagpur", "Surat", "Ahmedabad"];

function EnquiryPage() {
  const search = Route.useSearch();
  const [materialId, setMaterialId] = useState(materialById(search.material).id);
  const [supplierId, setSupplierId] = useState((suppliers[0] as (typeof suppliers)[number]).id);
  const [quantity, setQuantity] = useState("100");
  const [city, setCity] = useState(cities[0] as string);
  const [reference, setReference] = useState<string | null>(null);

  const material = materialById(materialId);
  const supplier =
    suppliers.find((s) => s.id === supplierId) ?? (suppliers[0] as (typeof suppliers)[number]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReference(`BW-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 md:py-20">
        <Card className="border-primary/50 shadow-glow">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </span>
            <h1 className="font-display text-2xl font-bold">Enquiry submitted</h1>
            <p className="text-muted-foreground">
              Your demo enquiry has been recorded. Quote reference:
            </p>
            <p className="rounded-lg bg-accent/50 px-4 py-2 font-display text-xl font-bold tracking-wide text-primary">
              {reference}
            </p>
            <div className="w-full rounded-lg border border-border bg-card p-4 text-left text-sm">
              <p>
                <span className="text-muted-foreground">Material:</span> {material.name}
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">Quantity:</span> {quantity} × {material.unit}
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">Preferred supplier:</span> {supplier.name}
              </p>
              <p className="mt-1">
                <span className="text-muted-foreground">Delivery city:</span> {city}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a datathon demo — no real order is placed and no supplier is contacted.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => setReference(null)}>New enquiry</Button>
              <Button asChild variant="outline">
                <Link to="/catalogue">Back to catalogue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
        Demo form · nothing is really ordered
      </Badge>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Order Enquiry</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Tell us what you need and where it should go. You'll get a demo reference number you can
        quote during the datathon walkthrough.
      </p>

      <Card className="mt-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required placeholder="Asha Verma" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company / firm</Label>
              <Input id="company" required placeholder="Verma Constructions" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" required placeholder="asha@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" required placeholder="+91 98200 00000" />
            </div>
            <div className="space-y-1.5">
              <Label>Material</Label>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
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
            <div className="space-y-1.5">
              <Label htmlFor="qty">Quantity ({material.unit})</Label>
              <Input
                id="qty"
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred supplier (fictional)</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Delivery city</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Preferred delivery date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes for the supplier</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Site access, unloading requirements, delivery window…"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <Button type="submit" size="lg" className="shadow-glow">
                <ClipboardList className="mr-1 h-4 w-4" /> Submit enquiry
              </Button>
              <p className="text-xs text-muted-foreground">
                Indicative demo value: {inr((parseFloat(quantity) || 0) * material.basePrice)} at
                list price.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
