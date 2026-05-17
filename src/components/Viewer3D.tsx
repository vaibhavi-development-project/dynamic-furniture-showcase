import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import { RotateCw } from "lucide-react";
import type { Product } from "@/lib/data";
import { colorToHex } from "@/lib/colors";

/**
 * Real procedural 3D models per category, colored from each product's palette.
 * Each product gets its OWN 3D mesh built from primitives and tinted with its
 * actual color so the 360° view always matches the product on screen.
 *
 * Variations applied per product:
 *  - shape varies by category (sofa / chair / table / bed / cabinet)
 *  - colour comes from product.color
 *  - SIZE scales the model (Small / Medium / Large / X-Large / King / Queen ...)
 *  - STYLE tweaks silhouette details (Chesterfield rolled arms, Art Deco curves,
 *    Mid-Century tapered legs, Scandinavian minimal frame, etc.)
 *  - MATERIAL roughness/metalness inferred from style + colour name
 *    (velvet = soft sheen, leather = glossy, boucle = matte, marble = polished)
 */

/* ---------- size + material helpers ---------- */

function sizeScale(size: string): number {
  const s = size.toLowerCase();
  if (s.includes("x-large") || s.includes("king")) return 1.15;
  if (s.includes("large") || s.includes("tall") || s.includes("240")) return 1.08;
  if (s.includes("queen") || s.includes("medium") || s.includes("standard")) return 1.0;
  if (s.includes("small") || s.includes("compact") || s.includes("counter")) return 0.85;
  return 1.0;
}

function materialFor(product: Product): { rough: number; metal: number } {
  const desc = (product.description + " " + product.style + " " + product.color).toLowerCase();
  if (desc.includes("velvet") || desc.includes("mohair")) return { rough: 0.35, metal: 0.05 };
  if (desc.includes("leather")) return { rough: 0.45, metal: 0.1 };
  if (desc.includes("marble") || desc.includes("lacquer") || desc.includes("onyx")) return { rough: 0.15, metal: 0.05 };
  if (desc.includes("boucle") || desc.includes("linen") || desc.includes("wool")) return { rough: 0.85, metal: 0.0 };
  return { rough: 0.55, metal: 0.05 };
}

function isChesterfield(product: Product) {
  return /chesterfield|tufted|wing/i.test(product.name + " " + product.style + " " + product.description);
}
function isCurved(product: Product) {
  return /curve|crescent|barrel|cloud|sculpt/i.test(product.name + " " + product.style + " " + product.description);
}
function isMidCentury(product: Product) {
  return /mid-century|scandinavian|japandi/i.test(product.style);
}
function isArtDeco(product: Product) {
  return /art deco|classic|imperial|royal/i.test(product.style + " " + product.name);
}

function Material({ color, rough = 0.55, metal = 0.05 }: { color: string; rough?: number; metal?: number }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={metal} />;
}
function GoldMaterial() {
  return <meshStandardMaterial color="#c9a35a" roughness={0.25} metalness={0.95} />;
}
function WoodMaterial({ tone = "#3a2418" }: { tone?: string }) {
  return <meshStandardMaterial color={tone} roughness={0.55} metalness={0.05} />;
}

/* ---------- Sofa ---------- */
function Sofa({ product, color }: { product: Product; color: string }) {
  const { rough, metal } = materialFor(product);
  const tufted = isChesterfield(product);
  const curved = isCurved(product);
  const deco = isArtDeco(product);
  const baseW = curved ? 2.6 : 3;
  const armH = tufted ? 0.95 : 0.7;

  return (
    <group position={[0, -0.2, 0]}>
      {/* base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        {curved ? <cylinderGeometry args={[1.5, 1.5, 0.5, 48, 1, false, -Math.PI / 2, Math.PI]} />
                : <boxGeometry args={[baseW, 0.5, 1.2]} />}
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      {/* back */}
      <mesh position={[0, 0.95, curved ? -0.1 : -0.5]} castShadow>
        {curved ? <cylinderGeometry args={[1.5, 1.5, 0.9, 48, 1, true, -Math.PI / 2, Math.PI]} />
                : <boxGeometry args={[baseW, tufted ? 1.1 : 0.9, 0.25]} />}
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      {/* arms (rolled if chesterfield) */}
      {!curved && (
        <>
          <mesh position={[-(baseW / 2 - 0.1), armH * 0.5 + 0.3, 0]} castShadow>
            {tufted ? <cylinderGeometry args={[0.35, 0.35, 1.2, 24]} />
                    : <boxGeometry args={[0.25, armH, 1.2]} />}
            {tufted && <Material color={color} rough={rough} metal={metal} />}
            {!tufted && <Material color={color} rough={rough} metal={metal} />}
          </mesh>
          <mesh position={[(baseW / 2 - 0.1), armH * 0.5 + 0.3, 0]} castShadow rotation={tufted ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
            {tufted ? <cylinderGeometry args={[0.35, 0.35, 1.2, 24]} />
                    : <boxGeometry args={[0.25, armH, 1.2]} />}
            <Material color={color} rough={rough} metal={metal} />
          </mesh>
        </>
      )}
      {/* tufted buttons */}
      {tufted && [-0.8, 0, 0.8].map(x => [-0.3, 0.3].map(y => (
        <mesh key={`${x}-${y}`} position={[x, 1.0 + y * 0.5, -0.36]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <GoldMaterial />
        </mesh>
      )))}
      {/* cushions */}
      {!curved && [-1, 0, 1].map((x) => (
        <mesh key={x} position={[x * (baseW / 3), 0.65, 0.05]} castShadow>
          <boxGeometry args={[baseW / 3 - 0.1, 0.25, 1]} />
          <Material color={color} rough={rough + 0.15} metal={metal} />
        </mesh>
      ))}
      {/* legs — tapered for mid-century, gold needle for deco */}
      {[[-1.3, -0.5], [1.3, -0.5], [-1.3, 0.5], [1.3, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} castShadow>
          <cylinderGeometry args={[0.04, deco ? 0.02 : 0.04, deco ? 0.3 : 0.2, 16]} />
          {deco ? <GoldMaterial /> : <WoodMaterial tone="#5a3a22" />}
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Chair ---------- */
function Chair({ product, color }: { product: Product; color: string }) {
  const { rough, metal } = materialFor(product);
  const curved = isCurved(product);
  const tall = /tall|wing/i.test(product.size + " " + product.name);
  const counter = /counter|stool/i.test(product.size + " " + product.name);

  if (counter) {
    return (
      <group position={[0, -0.6, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
          <Material color={color} rough={rough} metal={metal} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
          <GoldMaterial />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.06, 32]} />
          <GoldMaterial />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, -0.4, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        {curved ? <cylinderGeometry args={[0.6, 0.6, 0.18, 32]} />
                : <boxGeometry args={[1, 0.18, 1]} />}
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      <mesh position={[0, tall ? 1.35 : 1.1, -0.42]} castShadow>
        {curved ? <cylinderGeometry args={[0.6, 0.6, tall ? 1.4 : 1, 32, 1, true, -Math.PI / 2, Math.PI]} />
                : <boxGeometry args={[1, tall ? 1.4 : 1, 0.12]} />}
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      {!curved && (
        <>
          <mesh position={[-0.55, 0.78, 0]} castShadow>
            <boxGeometry args={[0.1, 0.5, 0.9]} />
            <Material color={color} rough={rough} metal={metal} />
          </mesh>
          <mesh position={[0.55, 0.78, 0]} castShadow>
            <boxGeometry args={[0.1, 0.5, 0.9]} />
            <Material color={color} rough={rough} metal={metal} />
          </mesh>
        </>
      )}
      {[[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.7, 16]} />
          {isMidCentury(product) ? <WoodMaterial tone="#5a3a22" /> : <GoldMaterial />}
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Table ---------- */
function Table({ product, color }: { product: Product; color: string }) {
  const { rough, metal } = materialFor(product);
  const oval = /oval/i.test(product.name);
  const nesting = /nesting/i.test(product.name);
  const desk = /desk|console/i.test(product.name);

  if (desk) {
    return (
      <group position={[0, -0.4, 0]}>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[2.4, 0.1, 0.9]} />
          <Material color={color} rough={rough} metal={metal} />
        </mesh>
        {[[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.42, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.85, 16]} />
            <GoldMaterial />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group position={[0, -0.4, 0]}>
      <mesh position={[0, 0.85, 0]} castShadow scale={oval ? [1.4, 1, 1] : [1, 1, 1]}>
        <cylinderGeometry args={[1.4, 1.4, 0.12, 64]} />
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 0.85, 32]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.08, 48]} />
        <GoldMaterial />
      </mesh>
      {nesting && (
        <mesh position={[0.6, 0.6, 0.4]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.08, 48]} />
          <Material color={color} rough={rough} metal={metal} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- Bed ---------- */
function Bed({ product, color }: { product: Product; color: string }) {
  const { rough, metal } = materialFor(product);
  const canopy = /canopy/i.test(product.name);
  const tufted = isChesterfield(product) || /fluted|tufted/i.test(product.name);
  const curved = isCurved(product);

  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[2.4, 0.3, 3]} />
        <WoodMaterial />
      </mesh>
      <mesh position={[0, 0.55, 0.15]} castShadow>
        <boxGeometry args={[2.2, 0.25, 2.6]} />
        <meshStandardMaterial color="#f0ebe0" roughness={0.8} />
      </mesh>
      {/* headboard */}
      <mesh position={[0, 1.1, -1.45]} castShadow>
        {curved ? <cylinderGeometry args={[1.2, 1.2, 1.6, 48, 1, true, -Math.PI / 2, Math.PI]} />
                : <boxGeometry args={[2.4, tufted ? 1.8 : 1.6, 0.2]} />}
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      {/* tufted/fluted vertical lines */}
      {tufted && [-0.9, -0.45, 0, 0.45, 0.9].map(x => (
        <mesh key={x} position={[x, 1.1, -1.34]}>
          <boxGeometry args={[0.04, 1.6, 0.02]} />
          <GoldMaterial />
        </mesh>
      ))}
      {/* canopy posts */}
      {canopy && [[-1.1, -1.4], [1.1, -1.4], [-1.1, 1.4], [1.1, 1.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.6, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 3, 16]} />
          <WoodMaterial tone="#3a2418" />
        </mesh>
      ))}
      {/* pillows */}
      <mesh position={[-0.55, 0.78, -1]} castShadow>
        <boxGeometry args={[0.9, 0.18, 0.5]} />
        <meshStandardMaterial color="#fafaf5" roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.78, -1]} castShadow>
        <boxGeometry args={[0.9, 0.18, 0.5]} />
        <meshStandardMaterial color="#fafaf5" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ---------- Cabinet ---------- */
function Cabinet({ product, color }: { product: Product; color: string }) {
  const { rough, metal } = materialFor(product);
  const tall = /tall|armoire|bookcase|display/i.test(product.size + " " + product.name);
  const drawers = /drawer|chest/i.test(product.name);
  const fluted = /fluted/i.test(product.name);

  const h = tall ? 2.4 : 1.6;
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, h / 2 + 0.1, 0]} castShadow>
        <boxGeometry args={[2.6, h, 0.7]} />
        <Material color={color} rough={rough} metal={metal} />
      </mesh>
      {/* doors / drawers */}
      {drawers
        ? [0.4, 0.95, 1.5].map((y, i) => (
            <group key={i}>
              <mesh position={[0, y, 0.36]}>
                <boxGeometry args={[2.4, 0.45, 0.02]} />
                <Material color={color} rough={rough * 0.7} metal={metal} />
              </mesh>
              <mesh position={[0, y, 0.4]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
                <GoldMaterial />
              </mesh>
            </group>
          ))
        : [-0.85, -0.15, 0.55].map((x, i) => (
            <group key={i}>
              {fluted
                ? Array.from({ length: 6 }).map((_, k) => (
                    <mesh key={k} position={[x - 0.25 + k * 0.1, h / 2 + 0.1, 0.36]}>
                      <cylinderGeometry args={[0.04, 0.04, h - 0.2, 12]} />
                      <Material color={color} rough={rough * 0.6} metal={metal} />
                    </mesh>
                  ))
                : (
                  <mesh position={[x, h / 2 + 0.1, 0.36]}>
                    <boxGeometry args={[0.6, h - 0.2, 0.02]} />
                    <Material color={color} rough={rough * 0.6} metal={metal} />
                  </mesh>
                )}
              <mesh position={[x + 0.25, h / 2 + 0.1, 0.4]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 12]} />
                <GoldMaterial />
              </mesh>
            </group>
          ))}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[2.5, 0.12, 0.6]} />
        <GoldMaterial />
      </mesh>
      {[[-1.15, -0.25], [1.15, -0.25], [-1.15, 0.25], [1.15, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
          <GoldMaterial />
        </mesh>
      ))}
    </group>
  );
}

function Model({ product, interactingRef }: { product: Product; interactingRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const color = colorToHex(product.color);
  const scale = useMemo(() => sizeScale(product.size), [product.size]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    // Pause auto-rotation during interaction, ease back in over ~1.2s after release.
    const since = performance.now() - interactingRef.current;
    const idleFactor = Math.min(1, Math.max(0, (since - 800) / 1200));
    ref.current.rotation.y += dt * 0.22 * idleFactor;
  });
  return (
    <group ref={ref} scale={scale}>
      {product.category === "Sofas" && <Sofa product={product} color={color} />}
      {product.category === "Chairs" && <Chair product={product} color={color} />}
      {product.category === "Tables" && <Table product={product} color={color} />}
      {product.category === "Beds" && <Bed product={product} color={color} />}
      {product.category === "Cabinets" && <Cabinet product={product} color={color} />}
    </group>
  );
}

export function Viewer3D({ product }: { product: Product }) {
  const interactingRef = useRef<number>(0);
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden glass-strong">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary glass px-3 py-1.5 rounded-full">
        <RotateCw size={12} /> Drag · Scroll to zoom
      </div>
      <div className="absolute top-4 right-4 z-10 text-[10px] uppercase tracking-[0.2em] text-muted-foreground glass px-3 py-1.5 rounded-full">
        {product.name} · {product.size}
      </div>
      <Canvas shadows camera={{ position: [4, 2.4, 5], fov: 38 }} dpr={[1, 2]}>
        <color attach="background" args={["#15110d"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
        <directionalLight position={[-4, 3, -4]} intensity={0.4} color="#c9a35a" />
        <Suspense fallback={null}>
          <Model product={product} interactingRef={interactingRef} />
          <ContactShadows position={[0, -0.95, 0]} opacity={0.55} blur={2.8} far={4} />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2.05}
          enableDamping
          dampingFactor={0.07}
          rotateSpeed={0.55}
          zoomSpeed={0.6}
          zoomToCursor
          makeDefault
          onStart={() => { interactingRef.current = performance.now() + 1e9; }}
          onChange={() => { interactingRef.current = performance.now() + 1e9; }}
          onEnd={() => { interactingRef.current = performance.now(); }}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
    </div>
  );
}
