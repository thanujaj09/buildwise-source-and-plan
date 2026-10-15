import { createFileRoute, Link } from "@tanstack/react-router";
import { Anvil, Blocks, LayoutGrid, Mountain, Package, Paintbrush, Search, TreePine } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { bestPrice, categories, inr, materials } from "@/lib/data";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Material Catalogue — BuildWise AI" },
      {
        name: "description",
        content:
          "Browse cement, steel, aggregates, bricks, timber and tiles with clearly labelled demo prices from fictional suppliers.",
      },
      { property: "og:title", content: "Material Catalogue — BuildWise AI" },
      {
        property: "og:description",
        content: "Twelve construction materials with demo prices from fictional suppliers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CataloguePage,
});

const categoryIcons: Record<string, typeof Package> = {
  "Cement & Concrete": Package,
  Steel: Anvil,
  Aggregates: Mountain,
  "Bricks & Blocks": Blocks,
  "Timber & Boards": TreePine,
  "Tiles & Finishing": Paintbrush,
};

function CataloguePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      materials.filter((m) => {
        const matchesCategory = !category || m.category === category;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      }),
    [query, category],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
        Demo prices · fictional suppliers
      </Badge>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Material Catalogue
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Every listing shows the best demo price across our five fictional suppliers. Tap a
        material to compare offers in detail.
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={category === null ? "default" : "outline"}
            onClick={() => setCategory(null)}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="p-8 text-center text-muted-foreground">
            No materials match your search. Try clearing the filters.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => {
            const Icon = categoryIcons[m.category] ?? LayoutGrid;
            return (
              <Card key={m.id} className="flex flex-col transition-colors hover:border-primary/60">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge variant="secondary">{m.category}</Badge>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{m.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Best demo price · {m.unit}</p>
                      <p className="font-display text-xl font-bold text-primary">
                        {inr(bestPrice(m.id))}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/compare" search={{ material: m.id }}>
                        Compare
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
