import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  ClipboardList,
  LayoutGrid,
  Scale,
  Sparkles,
  Truck,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { materials, suppliers } from "@/lib/data";
import heroImage from "@/assets/hero-construction.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildWise AI — Construction Material Procurement, Simplified" },
      {
        name: "description",
        content:
          "Estimate material quantities, compare fictional supplier prices and raise order enquiries in one place. BuildWise AI datathon prototype.",
      },
      { property: "og:title", content: "BuildWise AI — Construction Material Procurement" },
      {
        property: "og:description",
        content: "Estimate, compare and enquire — construction procurement for a datathon prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const features = [
  {
    to: "/catalogue",
    icon: LayoutGrid,
    title: "Material Catalogue",
    text: "Browse cement, steel, aggregates and more with clearly labelled demo prices.",
  },
  {
    to: "/compare",
    icon: Scale,
    title: "Supplier Comparison",
    text: "Line up fictional suppliers side by side — price, lead time, rating and stock.",
  },
  {
    to: "/estimator",
    icon: Calculator,
    title: "Quantity Estimator",
    text: "Turn slab, wall and flooring dimensions into material quantities instantly.",
  },
  {
    to: "/enquiry",
    icon: ClipboardList,
    title: "Order Enquiry",
    text: "Raise a structured purchase enquiry and get a reference number in seconds.",
  },
] as const;

const steps = [
  { icon: Calculator, title: "Estimate", text: "Enter project dimensions to get quantities." },
  { icon: Scale, title: "Compare", text: "See which demo supplier offers the best deal." },
  { icon: Truck, title: "Enquire", text: "Send one enquiry and track it with a reference." },
] as const;

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 10%, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/50 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Datathon prototype · demo data
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Procure smarter. <span className="text-gradient">Build faster.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              BuildWise AI helps contractors estimate quantities, compare supplier offers and
              raise purchase enquiries for construction materials — all in one workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/catalogue">
                  Browse catalogue <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/estimator">Try the estimator</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Construction site with stacked materials in navy and teal tones"
              className="w-full rounded-2xl border border-border object-cover shadow-card"
            />
            <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-card">
              <IndianRupee className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Best-price alerts</p>
                <p className="text-xs text-muted-foreground">across {suppliers.length} demo suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {[
            { value: String(materials.length), label: "Demo materials listed" },
            { value: String(suppliers.length), label: "Fictional suppliers" },
            { value: "3", label: "Estimator tools" },
            { value: "100%", label: "Labelled demo prices" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Four tools, one workflow
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Everything a site engineer needs to go from drawing to purchase enquiry.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-glow">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title}>
                <CardContent className="flex gap-4 p-5">
                  <div className="flex flex-col items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-primary/40 bg-accent/40 px-4 py-3 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              Every price in BuildWise AI is clearly marked as a demo price from a fictional
              supplier — safe to demo, impossible to mistake for a real quote.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
