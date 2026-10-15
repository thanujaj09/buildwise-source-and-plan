import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { avgPrice, inr } from "@/lib/data";

export const Route = createFileRoute("/estimator")({
  head: () => ({
    meta: [
      { title: "Quantity Estimator — BuildWise AI" },
      {
        name: "description",
        content:
          "Estimate cement, steel, sand, aggregate, bricks and tiles from simple project dimensions, with demo cost indications.",
      },
      { property: "og:title", content: "Quantity Estimator — BuildWise AI" },
      {
        property: "og:description",
        content: "Turn slab, wall and flooring dimensions into material quantities instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstimatorPage,
});

function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-12"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function ResultCard({
  rows,
  total,
}: {
  rows: { label: string; value: string }[];
  total: number;
}) {
  return (
    <Card className="border-primary/40">
      <CardContent className="p-5">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Calculator className="h-5 w-5 text-primary" /> Estimated quantities
        </h3>
        <dl className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-4 border-b border-border/50 pb-2 text-sm"
            >
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-semibold">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2.5">
          <span className="text-sm text-muted-foreground">Indicative demo cost</span>
          <span className="font-display text-xl font-bold text-primary">{inr(total)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Cost uses average demo prices across fictional suppliers. Add a 5–10% site wastage
          margin for real projects.
        </p>
      </CardContent>
    </Card>
  );
}

function EstimatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
        Rule-of-thumb formulas · demo costs
      </Badge>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Quantity Estimator
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Enter rough dimensions and get material quantities with an indicative demo cost. Choose a
        calculation below.
      </p>

      <Tabs defaultValue="slab" className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="slab">Concrete slab</TabsTrigger>
          <TabsTrigger value="wall">Brick wall</TabsTrigger>
          <TabsTrigger value="tiles">Floor tiles</TabsTrigger>
        </TabsList>

        <TabsContent value="slab" className="mt-6">
          <SlabEstimator />
        </TabsContent>
        <TabsContent value="wall" className="mt-6">
          <WallEstimator />
        </TabsContent>
        <TabsContent value="tiles" className="mt-6">
          <TileEstimator />
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-4">
        <p className="text-sm text-muted-foreground">
          Happy with the quantities? Compare demo supplier prices or raise an enquiry.
        </p>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/compare">Compare suppliers</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/enquiry">
              Raise enquiry <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlabEstimator() {
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("4");
  const [thickness, setThickness] = useState("125");

  const volume = num(length) * num(width) * (num(thickness) / 1000);
  const cementBags = Math.ceil(volume * 7);
  const sandT = volume * 0.55;
  const aggT = volume * 1.25;
  const steelKg = Math.round(volume * 80);
  const total =
    cementBags * avgPrice("cement-opc") +
    sandT * avgPrice("msand") +
    aggT * avgPrice("agg-20mm") +
    (steelKg / 1000) * avgPrice("tmt-fe500");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-5">
          <NumberField id="slab-l" label="Slab length" value={length} onChange={setLength} suffix="m" />
          <NumberField id="slab-w" label="Slab width" value={width} onChange={setWidth} suffix="m" />
          <NumberField
            id="slab-t"
            label="Slab thickness"
            value={thickness}
            onChange={setThickness}
            suffix="mm"
          />
          <p className="text-sm text-muted-foreground">
            Concrete volume: <span className="font-semibold text-foreground">{volume.toFixed(2)} m³</span>
          </p>
        </CardContent>
      </Card>
      <ResultCard
        rows={[
          { label: "OPC 53 cement (50 kg bags)", value: String(cementBags) },
          { label: "M-Sand", value: `${sandT.toFixed(2)} t` },
          { label: "20mm aggregate", value: `${aggT.toFixed(2)} t` },
          { label: "TMT steel Fe500", value: `${steelKg} kg` },
        ]}
        total={total}
      />
    </div>
  );
}

function WallEstimator() {
  const [length, setLength] = useState("8");
  const [height, setHeight] = useState("3");

  const area = num(length) * num(height);
  const bricks = Math.ceil(area * 55);
  const cementBags = Math.ceil(area * 0.18);
  const sandT = area * 0.025;
  const total =
    (bricks / 1000) * avgPrice("bricks-red") +
    cementBags * avgPrice("cement-ppc") +
    sandT * avgPrice("msand");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-5">
          <NumberField id="wall-l" label="Wall length" value={length} onChange={setLength} suffix="m" />
          <NumberField id="wall-h" label="Wall height" value={height} onChange={setHeight} suffix="m" />
          <p className="text-sm text-muted-foreground">
            Wall area: <span className="font-semibold text-foreground">{area.toFixed(2)} m²</span>{" "}
            (half-brick wall assumed)
          </p>
        </CardContent>
      </Card>
      <ResultCard
        rows={[
          { label: "Red clay bricks", value: bricks.toLocaleString("en-IN") },
          { label: "PPC cement (50 kg bags)", value: String(cementBags) },
          { label: "M-Sand", value: `${sandT.toFixed(2)} t` },
        ]}
        total={total}
      />
    </div>
  );
}

function TileEstimator() {
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");

  const area = num(length) * num(width);
  const tilesM2 = Math.ceil(area * 1.08);
  const adhesive = Math.ceil(area * 0.22);
  const grout = area * 0.35;
  const total = tilesM2 * avgPrice("tiles-ceramic");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-5">
          <NumberField id="tile-l" label="Room length" value={length} onChange={setLength} suffix="m" />
          <NumberField id="tile-w" label="Room width" value={width} onChange={setWidth} suffix="m" />
          <p className="text-sm text-muted-foreground">
            Floor area: <span className="font-semibold text-foreground">{area.toFixed(2)} m²</span>{" "}
            (8% wastage included in tiles)
          </p>
        </CardContent>
      </Card>
      <ResultCard
        rows={[
          { label: "Ceramic tiles 600×600", value: `${tilesM2} m²` },
          { label: "Tile adhesive (25 kg bags)", value: String(adhesive) },
          { label: "Grout", value: `${grout.toFixed(1)} kg` },
        ]}
        total={total}
      />
    </div>
  );
}
