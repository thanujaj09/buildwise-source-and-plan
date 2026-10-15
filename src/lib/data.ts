export interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  deliveryDays: number;
  minOrder: number;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  description: string;
  basePrice: number;
}

export interface Offer {
  materialId: string;
  supplier: Supplier;
  price: number;
  leadTimeDays: number;
  inStock: boolean;
}

export const suppliers: Supplier[] = [
  { id: "meridian", name: "Meridian BuildSupply", location: "Mumbai, MH", rating: 4.8, deliveryDays: 2, minOrder: 5000 },
  { id: "ironclad", name: "Ironclad Materials Co.", location: "Pune, MH", rating: 4.6, deliveryDays: 3, minOrder: 3000 },
  { id: "terrasource", name: "TerraSource Aggregates", location: "Nashik, MH", rating: 4.4, deliveryDays: 4, minOrder: 2000 },
  { id: "nexcore", name: "NexCore Trading", location: "Surat, GJ", rating: 4.2, deliveryDays: 5, minOrder: 1000 },
  { id: "blueridge", name: "BlueRidge Supply House", location: "Nagpur, MH", rating: 4.5, deliveryDays: 3, minOrder: 4000 },
];

export const categories = [
  "Cement & Concrete",
  "Steel",
  "Aggregates",
  "Bricks & Blocks",
  "Timber & Boards",
  "Tiles & Finishing",
] as const;

export const materials: Material[] = [
  { id: "cement-opc", name: "OPC 53 Grade Cement", category: "Cement & Concrete", unit: "50 kg bag", description: "High-strength ordinary Portland cement for structural concrete.", basePrice: 385 },
  { id: "cement-ppc", name: "Portland Pozzolana Cement", category: "Cement & Concrete", unit: "50 kg bag", description: "Durable, low-heat cement for masonry and plaster work.", basePrice: 350 },
  { id: "rmc-m25", name: "Ready-Mix Concrete M25", category: "Cement & Concrete", unit: "per m³", description: "Batching-plant concrete, M25 grade, pumped delivery.", basePrice: 5400 },
  { id: "tmt-fe500", name: "TMT Steel Rebar Fe500", category: "Steel", unit: "per tonne", description: "Thermo-mechanically treated reinforcement bars, ISI marked.", basePrice: 58500 },
  { id: "struct-steel", name: "Structural Steel Sections", category: "Steel", unit: "per tonne", description: "I-beams, channels and angles for frames and trusses.", basePrice: 62000 },
  { id: "agg-20mm", name: "Crushed Stone Aggregate 20mm", category: "Aggregates", unit: "per tonne", description: "Machine-crushed blue stone for RCC and PCC works.", basePrice: 950 },
  { id: "msand", name: "M-Sand (Manufactured Sand)", category: "Aggregates", unit: "per tonne", description: "Washed, graded manufactured sand for concrete and plaster.", basePrice: 1150 },
  { id: "bricks-red", name: "Red Clay Bricks", category: "Bricks & Blocks", unit: "per 1,000 units", description: "Kiln-burnt first-class bricks for load-bearing walls.", basePrice: 7800 },
  { id: "aac-blocks", name: "AAC Blocks 600×200×200", category: "Bricks & Blocks", unit: "per m³", description: "Lightweight autoclaved aerated concrete blocks.", basePrice: 3200 },
  { id: "plywood-18", name: "BWP Plywood 18mm", category: "Timber & Boards", unit: "per sheet (8×4 ft)", description: "Boiling-water-proof plywood for shuttering and interiors.", basePrice: 2450 },
  { id: "teak", name: "Seasoned Teak Hardwood", category: "Timber & Boards", unit: "per ft³", description: "Kiln-seasoned teak for doors, frames and joinery.", basePrice: 2800 },
  { id: "tiles-ceramic", name: "Ceramic Floor Tiles 600×600", category: "Tiles & Finishing", unit: "per m²", description: "Matte-finish vitrified ceramic tiles, skid resistant.", basePrice: 420 },
];

const priceSpread = [1, 0.96, 1.05, 0.92, 1.09];

export const offers: Offer[] = materials.flatMap((m, mi) =>
  suppliers.map((s, si) => ({
    materialId: m.id,
    supplier: s,
    price: Math.round(m.basePrice * (priceSpread[(mi + si) % priceSpread.length] ?? 1)),
    leadTimeDays: s.deliveryDays + ((mi + si) % 3 === 2 ? 1 : 0),
    inStock: (mi * 3 + si) % 6 !== 5,
  })),
);

export const offersFor = (materialId: string): Offer[] =>
  offers.filter((o) => o.materialId === materialId).sort((a, b) => a.price - b.price);

export const bestPrice = (materialId: string): number => offersFor(materialId)[0]?.price ?? 0;

export const avgPrice = (materialId: string): number => {
  const list = offersFor(materialId);
  return list.length ? list.reduce((sum, o) => sum + o.price, 0) / list.length : 0;
};

export const materialById = (id: string | undefined): Material =>
  materials.find((m) => m.id === id) ?? (materials[0] as Material);

export const inr = (n: number): string =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
