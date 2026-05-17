// Map product color names to actual hex values for procedural 3D rendering.
const MAP: Record<string, string> = {
  beige: "#d6c3a3", cream: "#ebe1cb", sand: "#cdb892", linen: "#d8cab1",
  taupe: "#a89682", camel: "#b88b56", cognac: "#7a3e1c", burgundy: "#5b1a1a",
  emerald: "#1f5d4a", navy: "#1c2a48", charcoal: "#2a2a2c", saffron: "#c98b2a",
  walnut: "#4a2e1d", oak: "#a87c4d", teak: "#8a5a32", natural: "#c9a878",
  "black lacquer": "#0e0e0f", "black oak": "#1a1614", "dark ash": "#2a241f",
  "burl walnut": "#5a3a22", zebrawood: "#8a5a30",
  "carrara white": "#ece8df", carrara: "#ece8df", travertine: "#cbb592",
  "nero marquina": "#1a1a1a", "cinnabar onyx": "#9a3a2a",
  "verde marble": "#2e5a4a", "linen beige": "#d6c3a3",
};

export function colorToHex(name: string): string {
  const k = name.toLowerCase().trim();
  if (MAP[k]) return MAP[k];
  // partial match
  for (const key in MAP) if (k.includes(key) || key.includes(k)) return MAP[key];
  return "#a89682";
}
