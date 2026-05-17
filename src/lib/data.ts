// Mock data layer. Swap these functions for fetch('/api/...') to your MongoDB backend.
import sofa1 from "@/assets/sofa-1.jpg";
import sofa2 from "@/assets/sofa-2.jpg";
import sofa3 from "@/assets/sofa-3.jpg";
import sofa4 from "@/assets/sofa-4.jpg";
import sofa5 from "@/assets/sofa-5.jpg";
import sofa6 from "@/assets/sofa-6.jpg";
import sofa7 from "@/assets/sofa-7.jpg";
import sofa8 from "@/assets/sofa-8.jpg";
import sofa9 from "@/assets/sofa-9.jpg";
import sofa10 from "@/assets/sofa-10.jpg";
import chair1 from "@/assets/chair-1.jpg";
import chair2 from "@/assets/chair-2.jpg";
import chair3 from "@/assets/chair-3.jpg";
import chair4 from "@/assets/chair-4.jpg";
import chair5 from "@/assets/chair-5.jpg";
import chair6 from "@/assets/chair-6.jpg";
import chair7 from "@/assets/chair-7.jpg";
import chair8 from "@/assets/chair-8.jpg";
import chair9 from "@/assets/chair-9.jpg";
import chair10 from "@/assets/chair-10.jpg";
import table1 from "@/assets/table-1.jpg";
import table2 from "@/assets/table-2.jpg";
import table3 from "@/assets/table-3.jpg";
import table4 from "@/assets/table-4.jpg";
import table5 from "@/assets/table-5.jpg";
import table6 from "@/assets/table-6.jpg";
import table7 from "@/assets/table-7.jpg";
import table8 from "@/assets/table-8.jpg";
import table9 from "@/assets/table-9.jpg";
import table10 from "@/assets/table-10.jpg";
import bed1 from "@/assets/bed-1.jpg";
import bed2 from "@/assets/bed-2.jpg";
import bed3 from "@/assets/bed-3.jpg";
import bed4 from "@/assets/bed-4.jpg";
import bed5 from "@/assets/bed-5.jpg";
import bed6 from "@/assets/bed-6.jpg";
import bed7 from "@/assets/bed-7.jpg";
import bed8 from "@/assets/bed-8.jpg";
import bed9 from "@/assets/bed-9.jpg";
import bed10 from "@/assets/bed-10.jpg";
import cabinet1 from "@/assets/cabinet-1.jpg";
import cabinet2 from "@/assets/cabinet-2.jpg";
import cabinet3 from "@/assets/cabinet-3.jpg";
import cabinet4 from "@/assets/cabinet-4.jpg";
import cabinet5 from "@/assets/cabinet-5.jpg";
import cabinet6 from "@/assets/cabinet-6.jpg";
import cabinet7 from "@/assets/cabinet-7.jpg";
import cabinet8 from "@/assets/cabinet-8.jpg";
import cabinet9 from "@/assets/cabinet-9.jpg";
import cabinet10 from "@/assets/cabinet-10.jpg";

import catSofas from "@/assets/cat-sofas.jpg";
import catChairs from "@/assets/cat-chairs.jpg";
import catTables from "@/assets/cat-tables.jpg";
import catBeds from "@/assets/cat-beds.jpg";
import catCabinets from "@/assets/cat-cabinets.jpg";

export type Category = "Sofas" | "Chairs" | "Tables" | "Beds" | "Cabinets";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  color: string;
  style: string;
  size: string;
  description: string;
  image: string;
  /** Optional GLB model URL for 360° viewer. Falls back to a default per category. */
  model?: string;
  featured?: boolean;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export const CATEGORY_IMAGES: Record<Category, string> = {
  Sofas: catSofas,
  Chairs: catChairs,
  Tables: catTables,
  Beds: catBeds,
  Cabinets: catCabinets,
};

// Display labels for categories — descriptive, English, premium-feeling.
export const CATEGORY_LABELS: Record<Category, string> = {
  Sofas: "Sofas & Sectionals",
  Chairs: "Chairs & Armchairs",
  Tables: "Tables & Centrepieces",
  Beds: "Beds & Headboards",
  Cabinets: "Cabinets & Storage",
};

// Free CC0 sample GLB models from KhronosGroup — used as 360° fallbacks per category.
const KHRONOS = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0";
export const CATEGORY_MODELS: Record<Category, string> = {
  Sofas: `${KHRONOS}/SheenChair/glTF-Binary/SheenChair.glb`,
  Chairs: `${KHRONOS}/SheenChair/glTF-Binary/SheenChair.glb`,
  Tables: `${KHRONOS}/AntiqueCamera/glTF-Binary/AntiqueCamera.glb`,
  Beds: `${KHRONOS}/SheenChair/glTF-Binary/SheenChair.glb`,
  Cabinets: `${KHRONOS}/AntiqueCamera/glTF-Binary/AntiqueCamera.glb`,
};

const SEED_PRODUCTS: Product[] = [
  // ── Sofas & Sectionals ───────────────────────────────────
  { id: "s1", name: "Royal Boucle Sectional Sofa", category: "Sofas", price: 389000, color: "Beige", style: "Modern", size: "Large", description: "A sculptural boucle sectional that anchors the living room with quiet presence. Hand-finished sheesham frame and down-wrapped cushions.", image: sofa1, featured: true },
  { id: "s2", name: "Imperial Curved Velvet Sofa", category: "Sofas", price: 425000, color: "Emerald", style: "Art Deco", size: "Medium", description: "Tufted velvet on a sweeping curved silhouette — equal parts cinema and lounge.", image: sofa2, featured: true },
  { id: "s3", name: "Emerald Crescent Velvet Sofa", category: "Sofas", price: 469000, color: "Emerald", style: "Art Deco", size: "Large", description: "Channel-tufted velvet on slim brass legs — a centrepiece for the drawing room.", image: sofa3, featured: true },
  { id: "s4", name: "Heritage Linen Three-Seater", category: "Sofas", price: 309000, color: "Cream", style: "Scandinavian", size: "Large", description: "Low-slung silhouette in heavy linen on a solid walnut base.", image: sofa4 },
  { id: "s5", name: "Cloud Modular Sectional", category: "Sofas", price: 495000, color: "Taupe", style: "Modern", size: "X-Large", description: "Deep modular boucle seating on polished brass needle feet.", image: sofa5, featured: true },
  { id: "s6", name: "Classic Leather Chesterfield", category: "Sofas", price: 439000, color: "Cognac", style: "Classic", size: "Large", description: "Hand-tufted full-grain leather Chesterfield with rolled arms.", image: sofa6 },
  { id: "s7", name: "Midnight Velvet Loveseat", category: "Sofas", price: 265000, color: "Charcoal", style: "Modern", size: "Small", description: "Two-seater in deep charcoal velvet floating on polished brass arms.", image: sofa7 },
  { id: "s8", name: "Sand Curved Boucle Sofa", category: "Sofas", price: 369000, color: "Sand", style: "Modern", size: "Medium", description: "Sculptural curved boucle with a hidden oak base.", image: sofa8 },
  { id: "s9", name: "Ruby Mohair Settee", category: "Sofas", price: 399000, color: "Burgundy", style: "Art Deco", size: "Medium", description: "Burgundy mohair velvet with delicate gold piping.", image: sofa9 },
  { id: "s10", name: "Heritage Camel Three-Seater", category: "Sofas", price: 345000, color: "Camel", style: "Mid-Century", size: "Large", description: "Camel leather mid-century icon on tapered walnut legs.", image: sofa10 },

  // ── Chairs & Armchairs ───────────────────────────────────
  { id: "c1", name: "Heritage Leather Lounge Chair", category: "Chairs", price: 175000, color: "Cognac", style: "Mid-Century", size: "Standard", description: "Full-grain leather lounge chair on a brushed brass swivel base.", image: chair1, featured: true },
  { id: "c2", name: "Classic Wool Wing Chair", category: "Chairs", price: 145000, color: "Cream", style: "Scandinavian", size: "Standard", description: "Soft wool boucle hugging a walnut frame — the quiet chair you will always reach for.", image: chair2 },
  { id: "c3", name: "Cream Boucle Wing Chair", category: "Chairs", price: 152000, color: "Cream", style: "Modern", size: "Standard", description: "Sculptural boucle wing chair on a slim walnut spider base.", image: chair3 },
  { id: "c4", name: "Solid Oak Lounger", category: "Chairs", price: 135000, color: "Sand", style: "Scandinavian", size: "Standard", description: "Solid oak frame cradling soft sand-coloured linen cushions.", image: chair4 },
  { id: "c5", name: "Emerald Velvet Swivel Chair", category: "Chairs", price: 185000, color: "Emerald", style: "Art Deco", size: "Standard", description: "Emerald velvet swivel armchair on a polished brass plinth.", image: chair5, featured: true },
  { id: "c6", name: "Sculpted Walnut Sling Chair", category: "Chairs", price: 159000, color: "Cognac", style: "Sculptural", size: "Standard", description: "Hand-shaped walnut frame with a cognac leather sling seat.", image: chair6 },
  { id: "c7", name: "Curved Mohair Barrel Chair", category: "Chairs", price: 129000, color: "Taupe", style: "Modern", size: "Compact", description: "Curved barrel back in taupe mohair on a brass drum base.", image: chair7 },
  { id: "c8", name: "Bent Oak Rocking Chair", category: "Chairs", price: 112000, color: "Natural", style: "Scandinavian", size: "Standard", description: "Bent oak rocking chair softened with cream sheepskin.", image: chair8 },
  { id: "c9", name: "Royal Tufted Wingback", category: "Chairs", price: 199000, color: "Navy", style: "Classic", size: "Tall", description: "Tufted navy velvet with brass nailheads on tapered legs.", image: chair9 },
  { id: "c10", name: "Brass Counter Bar Stool", category: "Chairs", price: 79000, color: "Cognac", style: "Modern", size: "Counter", description: "Cognac leather seat on a slim brass column with footrest.", image: chair10 },

  // ── Tables & Centrepieces ────────────────────────────────
  { id: "t1", name: "White Marble Round Dining Table", category: "Tables", price: 275000, color: "White Marble", style: "Contemporary", size: "Ø140cm", description: "White marble dining table with a polished brass plinth.", image: table1, featured: true },
  { id: "t2", name: "Travertine Round Coffee Table", category: "Tables", price: 159000, color: "Travertine", style: "Brutalist", size: "Ø100cm", description: "Solid travertine, softly rounded — a grounding centrepiece.", image: table2 },
  { id: "t3", name: "Travertine Drum Coffee Table", category: "Tables", price: 135000, color: "Travertine", style: "Brutalist", size: "Ø90cm", description: "Sculpted travertine drum table with a hand-rounded edge.", image: table3 },
  { id: "t4", name: "White Marble Console Table", category: "Tables", price: 175000, color: "White Marble", style: "Contemporary", size: "180cm", description: "White marble top on a slim walnut frame with brass legs.", image: table4 },
  { id: "t5", name: "Black Marble Oval Dining Table", category: "Tables", price: 389000, color: "Black Marble", style: "Art Deco", size: "240cm", description: "Black marble oval on a sculpted brass pedestal.", image: table5, featured: true },
  { id: "t6", name: "Onyx Glow Side Table", category: "Tables", price: 105000, color: "Cinnabar Onyx", style: "Sculptural", size: "Ø45cm", description: "Glowing onyx drum with a brushed brass band.", image: table6 },
  { id: "t7", name: "Marble Nesting Table Set", category: "Tables", price: 152000, color: "White Marble", style: "Modern", size: "Set of 2", description: "White marble nesting tables on brushed brass frames.", image: table7 },
  { id: "t8", name: "Walnut Heritage Writing Desk", category: "Tables", price: 255000, color: "Walnut", style: "Classic", size: "160cm", description: "Walnut top with leather inlay on tapered brass legs.", image: table8 },
  { id: "t9", name: "Sculpted Travertine Coffee Table", category: "Tables", price: 192000, color: "Travertine", style: "Sculptural", size: "Ø120cm", description: "Organic asymmetric travertine slab on a hidden plinth.", image: table9 },
  { id: "t10", name: "Green Marble Round Dining Table", category: "Tables", price: 345000, color: "Green Marble", style: "Art Deco", size: "Ø160cm", description: "Polished green marble top on a sculpted bronze base.", image: table10, featured: true },

  // ── Beds & Headboards ────────────────────────────────────
  { id: "b1", name: "Royal Linen Upholstered Bed", category: "Beds", price: 309000, color: "Linen Beige", style: "Classic", size: "King", description: "Hand-tufted linen headboard with antique brass nailhead detailing.", image: bed1, featured: true },
  { id: "b2", name: "Charcoal Tufted Platform Bed", category: "Beds", price: 345000, color: "Charcoal", style: "Modern", size: "King", description: "Channel-tufted charcoal velvet on a low platform with brass plinth.", image: bed2 },
  { id: "b3", name: "Royal Walnut Canopy Bed", category: "Beds", price: 519000, color: "Walnut", style: "Classic", size: "King", description: "Solid walnut four-poster canopy bed with hand-cast brass details.", image: bed3 },
  { id: "b4", name: "Curved Cream Boucle Bed", category: "Beds", price: 285000, color: "Cream", style: "Modern", size: "Queen", description: "Curved cream boucle headboard on an oak platform.", image: bed4 },
  { id: "b5", name: "Saffron Fluted Velvet Bed", category: "Beds", price: 389000, color: "Saffron", style: "Art Deco", size: "King", description: "Fluted velvet headboard in saffron with brass inlay.", image: bed5, featured: true },
  { id: "b6", name: "Minimalist Walnut Platform Bed", category: "Beds", price: 232000, color: "Walnut", style: "Japandi", size: "King", description: "Minimal walnut platform bed dressed with linen bedding.", image: bed6 },
  { id: "b7", name: "Imperial Wing Bed", category: "Beds", price: 425000, color: "Taupe", style: "Classic", size: "King", description: "Oversized winged headboard in taupe mohair with gold studs.", image: bed7 },
  { id: "b8", name: "Solid Oak Platform Bed", category: "Beds", price: 215000, color: "Natural", style: "Scandinavian", size: "King", description: "Solid oak platform bed with sand cotton bedding and round bolster.", image: bed8 },
  { id: "b9", name: "Emerald Curved Velvet Bed", category: "Beds", price: 369000, color: "Emerald", style: "Art Deco", size: "King", description: "Sculptural curved emerald velvet headboard on brass legs.", image: bed9 },
  { id: "b10", name: "Cognac Leather Tufted Bed", category: "Beds", price: 439000, color: "Cognac", style: "Classic", size: "King", description: "Tufted Chesterfield headboard in cognac leather with brass nailheads.", image: bed10 },

  // ── Cabinets & Storage ───────────────────────────────────
  { id: "k1", name: "Walnut Brass Sideboard", category: "Cabinets", price: 345000, color: "Walnut", style: "Mid-Century", size: "220cm", description: "Solid walnut sideboard with brass inlay and soft-close doors.", image: cabinet1, featured: true },
  { id: "k2", name: "Royal Walnut Display Cabinet", category: "Cabinets", price: 469000, color: "Walnut", style: "Classic", size: "220cm tall", description: "Walnut display cabinet with bronze mullions and hand-blown reeded glass.", image: cabinet2 },
  { id: "k3", name: "Fluted Oak Sideboard", category: "Cabinets", price: 309000, color: "Oak", style: "Modern", size: "200cm", description: "Hand-fluted oak doors over a polished brass plinth.", image: cabinet3, featured: true },
  { id: "k4", name: "Black Lacquer Bar Cabinet", category: "Cabinets", price: 499000, color: "Black Lacquer", style: "Art Deco", size: "180cm tall", description: "Lacquered black bar cabinet with polished brass interior shelving.", image: cabinet4 },
  { id: "k5", name: "Teak Cane Credenza", category: "Cabinets", price: 265000, color: "Teak", style: "Mid-Century", size: "220cm", description: "Solid teak credenza with woven cane sliding doors on brass legs.", image: cabinet5 },
  { id: "k6", name: "Royal Burl Walnut Armoire", category: "Cabinets", price: 579000, color: "Burl Walnut", style: "Classic", size: "240cm tall", description: "Burl walnut armoire with hand-cast brass and intricate marquetry.", image: cabinet6 },
  { id: "k7", name: "Slim Black Oak Console", category: "Cabinets", price: 199000, color: "Black Oak", style: "Modern", size: "160cm", description: "Slim matte black oak console with brushed gold pulls.", image: cabinet7 },
  { id: "k8", name: "Walnut Display Bookcase", category: "Cabinets", price: 439000, color: "Walnut", style: "Modern", size: "240cm tall", description: "Open walnut shelving with brass brackets on a travertine base.", image: cabinet8 },
  { id: "k9", name: "Zebrawood Six-Drawer Chest", category: "Cabinets", price: 359000, color: "Zebrawood", style: "Art Deco", size: "120cm", description: "Six-drawer dresser in book-matched zebrawood with brass pulls.", image: cabinet9 },
  { id: "k10", name: "Fluted Ash Media Console", category: "Cabinets", price: 295000, color: "Dark Ash", style: "Modern", size: "220cm", description: "Long fluted dark ash media console with a glowing brass toe-kick.", image: cabinet10 },
];

const DEFAULT_CONTACT: ContactInfo = {
  phone: "+91 7208396020",
  whatsapp: "917208396020",
  email: "vaibhavidavee@gmail.com",
  address: "Studio 12, Linking Road, Bandra West, Mumbai · DLF Emporio, Vasant Kunj, New Delhi",
};

const PRODUCTS_KEY = "maisonor.products.v3";
const CONTACT_KEY = "maisonor.contact.v1";

function isBrowser() { return typeof window !== "undefined"; }

export function getProducts(): Product[] {
  if (!isBrowser()) return SEED_PRODUCTS;
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  try { return JSON.parse(raw) as Product[]; } catch { return SEED_PRODUCTS; }
}

export function saveProducts(products: Product[]) {
  if (!isBrowser()) return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("maisonor:data"));
}

export function getProduct(id: string) { return getProducts().find(p => p.id === id); }

export function upsertProduct(p: Product) {
  const list = getProducts();
  const idx = list.findIndex(x => x.id === p.id);
  if (idx >= 0) list[idx] = p; else list.push(p);
  saveProducts(list);
}

export function deleteProduct(id: string) {
  saveProducts(getProducts().filter(p => p.id !== id));
}

export function getContact(): ContactInfo {
  if (!isBrowser()) return DEFAULT_CONTACT;
  const raw = localStorage.getItem(CONTACT_KEY);
  if (!raw) {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(DEFAULT_CONTACT));
    return DEFAULT_CONTACT;
  }
  try { return JSON.parse(raw) as ContactInfo; } catch { return DEFAULT_CONTACT; }
}

export function saveContact(c: ContactInfo) {
  if (!isBrowser()) return;
  localStorage.setItem(CONTACT_KEY, JSON.stringify(c));
  window.dispatchEvent(new Event("maisonor:data"));
}

export const CATEGORIES: Category[] = ["Sofas", "Chairs", "Tables", "Beds", "Cabinets"];

/** Returns the GLB model URL for a product, falling back to its category default. */
export function getProductModel(p: Product): string {
  return p.model || CATEGORY_MODELS[p.category];
}
