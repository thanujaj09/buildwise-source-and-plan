import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Info, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
          "Estimate cement, steel, sand, aggregate, bricks and tiles from simple project dimensions, with formulas, stated assumptions and fictional demo costs.",
      },
      { property: "og:title", content: "Quantity Estimator — BuildWise AI" },
      {
        property: "og:description",
        content:
          "Turn slab, wall and flooring dimensions into illustrative material quantities with clear assumptions and demo prices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstimatorPage,
});

/* ---------------------------------- types --------------------------------- */

interface Cta {
  materialId: string;
  quantity: number;
  label: string;
}

interface CostRow {
  label: string;
  detail: string;
  amount: number;
}

/* ------------------------------- validation ------------------------------- */

function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function validateDim(
  raw: string,
  label: string,
  min: number,
  max: number,
  unit: string,
): string | null {
  if (raw.trim() === "") return `Enter the ${label} — this field is required.`;
  const n = Number(raw);
  if (!Number.isFinite(n)) return `The ${label} must be a number.`;
  if (n <= 0) return `The ${label} must be greater than zero.`;
  if (n < min) return `That ${label} looks too small — the minimum is ${min} ${unit}.`;
  if (n > max)
    return `That ${label} looks unrealistic (max ${max} ${unit}) — please check the units.`;
  return null;
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  error: string | null;
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
          aria-invalid={error ? true : undefined}
          className={error ? "border-destructive pr-12" : "pr-12"}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ------------------------------- result card ------------------------------ */

function ResultCard({
  valid,
  formula,
  worked,
  quantities,
  assumptions,
  costs,
  total,
}: {
  valid: boolean;
  formula: string;
  worked: string;
  quantities: { label: string; value: string }[];
  assumptions: string[];
  costs: CostRow[];
  total: number;
}) {
  if (!valid) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <TriangleAlert className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">Fix the highlighted dimensions</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Quantities and the indicative demo cost will appear here as soon as every dimension is
            a valid, realistic number.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/40">
      <CardContent className="space-y-5 p-5">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Calculator className="h-5 w-5 text-primary" /> Illustrative demo estimate
        </h3>

        <div className="rounded-lg bg-accent/40 px-3 py-2.5 text-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Formula used
          </p>
          <p className="mt-1 font-medium">{formula}</p>
          <p className="mt-0.5 text-muted-foreground">{worked}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Calculated from your dimensions
          </p>
          <dl className="mt-2 space-y-2.5">
            {quantities.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-4 border-b border-border/50 pb-2 text-sm"
              >
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="font-semibold">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg border border-border/70 bg-card/60 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Info className="h-3.5 w-3.5" /> Assumptions behind these numbers
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            {assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Indicative demo cost · fictional prices
          </p>
          <dl className="mt-2 space-y-2">
            {costs.map((c) => (
              <div key={c.label} className="flex items-baseline justify-between gap-4 text-sm">
                <dt className="text-muted-foreground">
                  <span className="text-foreground">{c.label}</span>
                  <span className="block text-xs">{c.detail}</span>
                </dt>
                <dd className="font-semibold">{inr(c.amount)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2.5">
          <span className="text-sm text-muted-foreground">Indicative demo total</span>
          <span className="font-display text-xl font-bold text-primary">{inr(total)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          The total uses the average of fictional demo prices across five made-up suppliers, and
          the assumptions listed above. It is not a quote.
        </p>
      </CardContent>
    </Card>
  );
}

/* --------------------------------- page ----------------------------------- */

function EstimatorPage() {
  const [cta, setCta] = useState<Cta | null>(null);
  const reportCta = useCallback((next: Cta | null) => setCta(next), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
        Rule-of-thumb formulas · fictional demo prices
      </Badge>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Quantity Estimator
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Enter rough dimensions and get illustrative material quantities with an indicative demo
        cost. Every formula and assumption is shown with the result.
      </p>

      <Tabs defaultValue="slab" className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="slab">Concrete slab</TabsTrigger>
          <TabsTrigger value="wall">Brick wall</TabsTrigger>
          <TabsTrigger value="tiles">Floor tiles</TabsTrigger>
        </TabsList>

        <TabsContent value="slab" className="mt-6">
          <SlabEstimator onCta={reportCta} />
        </TabsContent>
        <TabsContent value="wall" className="mt-6">
          <WallEstimator onCta={reportCta} />
        </TabsContent>
        <TabsContent value="tiles" className="mt-6">
          <TileEstimator onCta={reportCta} />
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {cta ? (
            <>
              Carrying forward:{" "}
              <span className="font-medium text-foreground">{cta.label}</span>
            </>
          ) : (
            "Enter valid dimensions above and the main material will be carried forward."
          )}
        </p>
        <div className="ml-auto flex gap-2">
          {cta ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/compare" search={{ material: cta.materialId }}>
                  Compare suppliers
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/enquiry" search={{ material: cta.materialId, quantity: cta.quantity }}>
                  Raise enquiry <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" disabled>
                Compare suppliers
              </Button>
              <Button size="sm" disabled>
                Raise enquiry <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 rounded-xl border border-border/70 bg-card/60 px-4 py-3 text-xs text-muted-foreground">
        BuildWise AI is a planning prototype for a datathon. Quantities use rule-of-thumb
        assumptions and all prices are fictional demo values — nothing here is a substitute for a
        qualified construction professional's material schedule or structural design.
      </p>
    </div>
  );
}

/* ------------------------------ slab estimator ----------------------------- */

function SlabEstimator({ onCta }: { onCta: (c: Cta | null) => void }) {
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("4");
  const [thickness, setThickness] = useState("125");

  const errors = {
    length: validateDim(length, "slab length", 0.1, 100, "m"),
    width: validateDim(width, "slab width", 0.1, 100, "m"),
    thickness: validateDim(thickness, "slab thickness", 50, 500, "mm"),
  };
  const valid = !errors.length && !errors.width && !errors.thickness;

  const L = num(length);
  const W = num(width);
  const T = num(thickness);
  const volume = valid ? L * W * (T / 1000) : 0;

  const cementBags = Math.ceil(volume * 7);
  const sandT = volume * 0.55;
  const aggT = volume * 1.25;
  const steelKg = Math.round(volume * 80);

  const costs: CostRow[] = [
    {
      label: "OPC 53 cement",
      detail: `${cementBags} bags × ${inr(avgPrice("cement-opc"))} avg demo price per bag`,
      amount: cementBags * avgPrice("cement-opc"),
    },
    {
      label: "M-Sand",
      detail: `${sandT.toFixed(2)} t × ${inr(avgPrice("msand"))} avg demo price per tonne`,
      amount: sandT * avgPrice("msand"),
    },
    {
      label: "20mm aggregate",
      detail: `${aggT.toFixed(2)} t × ${inr(avgPrice("agg-20mm"))} avg demo price per tonne`,
      amount: aggT * avgPrice("agg-20mm"),
    },
    {
      label: "TMT steel Fe500 (illustrative allowance)",
      detail: `${steelKg} kg × ${inr(avgPrice("tmt-fe500"))} avg demo price per tonne`,
      amount: (steelKg / 1000) * avgPrice("tmt-fe500"),
    },
  ];
  const total = costs.reduce((sum, c) => sum + c.amount, 0);

  useEffect(() => {
    onCta(
      valid
        ? {
            materialId: "cement-opc",
            quantity: cementBags,
            label: `${cementBags} bags of OPC 53 cement`,
          }
        : null,
    );
  }, [valid, cementBags, onCta]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-5">
          <NumberField
            id="slab-l"
            label="Slab length"
            value={length}
            onChange={setLength}
            suffix="m"
            error={errors.length}
          />
          <NumberField
            id="slab-w"
            label="Slab width"
            value={width}
            onChange={setWidth}
            suffix="m"
            error={errors.width}
          />
          <NumberField
            id="slab-t"
            label="Slab thickness"
            value={thickness}
            onChange={setThickness}
            suffix="mm"
            error={errors.thickness}
          />
          <p className="text-sm text-muted-foreground">
            Concrete volume:{" "}
            <span className="font-semibold text-foreground">
              {valid ? `${volume.toFixed(2)} m³` : "—"}
            </span>
          </p>
        </CardContent>
      </Card>
      <ResultCard
        valid={valid}
        formula="Volume = length × width × (thickness in mm ÷ 1000)"
        worked={
          valid
            ? `${L} m × ${W} m × (${T} ÷ 1000) m = ${volume.toFixed(2)} m³ of concrete`
            : "Waiting for valid dimensions…"
        }
        quantities={[
          { label: "OPC 53 cement (50 kg bags)", value: String(cementBags) },
          { label: "M-Sand", value: `${sandT.toFixed(2)} t` },
          { label: "20mm aggregate", value: `${aggT.toFixed(2)} t` },
          { label: "TMT steel Fe500 (illustrative)", value: `${steelKg} kg` },
        ]}
        assumptions={[
          "Illustrative nominal mix: about 7 bags (350 kg) of cement per m³ of concrete.",
          "Illustrative mix: about 0.55 t of sand and 1.25 t of 20mm aggregate per m³.",
          "The 80 kg/m³ steel figure is a placeholder allowance for demo costing only — it is NOT an engineering recommendation. Real reinforcement must come from a structural engineer's design.",
          "No wastage margin is included; add 5–10% for real projects.",
        ]}
        costs={costs}
        total={total}
      />
    </div>
  );
}

/* ------------------------------ wall estimator ----------------------------- */

function WallEstimator({ onCta }: { onCta: (c: Cta | null) => void }) {
  const [length, setLength] = useState("8");
  const [height, setHeight] = useState("3");

  const errors = {
    length: validateDim(length, "wall length", 0.1, 200, "m"),
    height: validateDim(height, "wall height", 0.1, 10, "m"),
  };
  const valid = !errors.length && !errors.height;

  const L = num(length);
  const H = num(height);
  const area = valid ? L * H : 0;

  const bricks = Math.ceil(area * 55);
  const cementBags = Math.ceil(area * 0.18);
  const sandT = area * 0.025;

  const costs: CostRow[] = [
    {
      label: "Red clay bricks",
      detail: `${bricks.toLocaleString("en-IN")} bricks × ${inr(avgPrice("bricks-red"))} avg demo price per 1,000`,
      amount: (bricks / 1000) * avgPrice("bricks-red"),
    },
    {
      label: "PPC cement",
      detail: `${cementBags} bags × ${inr(avgPrice("cement-ppc"))} avg demo price per bag`,
      amount: cementBags * avgPrice("cement-ppc"),
    },
    {
      label: "M-Sand",
      detail: `${sandT.toFixed(2)} t × ${inr(avgPrice("msand"))} avg demo price per tonne`,
      amount: sandT * avgPrice("msand"),
    },
  ];
  const total = costs.reduce((sum, c) => sum + c.amount, 0);

  useEffect(() => {
    onCta(
      valid
        ? {
            materialId: "bricks-red",
            quantity: Math.max(1, Math.round(bricks / 1000)),
            label: `${bricks.toLocaleString("en-IN")} red clay bricks`,
          }
        : null,
    );
  }, [valid, bricks, onCta]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-5">
          <NumberField
            id="wall-l"
            label="Wall length"
            value={length}
            onChange={setLength}
            suffix="m"
            error={errors.length}
          />
          <NumberField
            id="wall-h"
            label="Wall height"
            value={height}
            onChange={setHeight}
            suffix="m"
            error={errors.height}
          />
          <p className="text-sm text-muted-foreground">
            Wall area:{" "}
            <span className="font-semibold text-foreground">
              {valid ? `${area.toFixed(2)} m²` : "—"}
            </span>{" "}
            (half-brick wall assumed)
          </p>
        </CardContent>
      </Card>
      <ResultCard
        valid={valid}
        formula="Wall area = length × height"
        worked={valid ? `${L} m × ${H} m = ${area.toFixed(2)} m² of wall` : "Waiting for valid dimensions…"}
        quantities={[
          { label: "Red clay bricks", value: bricks.toLocaleString("en-IN") },
          { label: "PPC cement (50 kg bags)", value: String(cementBags) },
          { label: "M-Sand", value: `${sandT.toFixed(2)} t` },
        ]}
        assumptions={[
          "A half-brick (about 115 mm thick) wall is assumed, using modular bricks with mortar — about 55 bricks per m².",
          "Illustrative mortar: about 0.18 bags of cement and 0.025 t of sand per m² of wall.",
          "Door and window openings are not deducted — subtract their area yourself for a closer figure.",
          "No wastage margin is included; add 5–10% for real projects.",
        ]}
        costs={costs}
        total={total}
      />
    </div>
  );
}

/* ------------------------------ tile estimator ----------------------------- */

function TileEstimator({ onCta }: { onCta: (c: Cta | null) => void }) {
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");

  const errors = {
    length: validateDim(length, "room length", 0.1, 100, "m"),
    width: validateDim(width, "room width", 0.1, 100, "m"),
  };
  const valid = !errors.length && !errors.width;

  const L = num(length);
  const W = num(width);
  const area = valid ? L * W : 0;

  const tilesM2 = Math.ceil(area * 1.08);
  const adhesive = Math.ceil(area * 0.22);
  const grout = area * 0.35;

  const costs: CostRow[] = [
    {
      label: "Ceramic tiles 600×600",
      detail: `${tilesM2} m² × ${inr(avgPrice("tiles-ceramic"))} avg demo price per m²`,
      amount: tilesM2 * avgPrice("tiles-ceramic"),
    },
  ];
  const total = costs.reduce((sum, c) => sum + c.amount, 0);

  useEffect(() => {
    onCta(
      valid
        ? {
            materialId: "tiles-ceramic",
            quantity: tilesM2,
            label: `${tilesM2} m² of ceramic floor tiles`,
          }
        : null,
    );
  }, [valid, tilesM2, onCta]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-5">
          <NumberField
            id="tile-l"
            label="Room length"
            value={length}
            onChange={setLength}
            suffix="m"
            error={errors.length}
          />
          <NumberField
            id="tile-w"
            label="Room width"
            value={width}
            onChange={setWidth}
            suffix="m"
            error={errors.width}
          />
          <p className="text-sm text-muted-foreground">
            Floor area:{" "}
            <span className="font-semibold text-foreground">
              {valid ? `${area.toFixed(2)} m²` : "—"}
            </span>{" "}
            (8% wastage included in tiles)
          </p>
        </CardContent>
      </Card>
      <ResultCard
        valid={valid}
        formula="Floor area = length × width; tiles = area × 1.08"
        worked={
          valid
            ? `${L} m × ${W} m = ${area.toFixed(2)} m²; ${area.toFixed(2)} × 1.08 = ${(area * 1.08).toFixed(2)} → ${tilesM2} m² of tiles`
            : "Waiting for valid dimensions…"
        }
        quantities={[
          { label: "Ceramic tiles 600×600", value: `${tilesM2} m²` },
          { label: "Tile adhesive (25 kg bags)", value: String(adhesive) },
          { label: "Grout", value: `${grout.toFixed(1)} kg` },
        ]}
        assumptions={[
          "8% extra tiles are added for cutting and breakage.",
          "Illustrative coverage: one 25 kg bag of adhesive per ~4.5 m² and about 0.35 kg of grout per m².",
          "Skirting, thresholds and pattern cuts are not included.",
          "Adhesive and grout are not in the demo catalogue, so the demo total covers tiles only.",
        ]}
        costs={costs}
        total={total}
      />
    </div>
  );
}
