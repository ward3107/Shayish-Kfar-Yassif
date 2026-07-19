import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import type { Mesh } from 'three';
import { MeshPhysicalMaterial, CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Interactive 3D marble slab. Drag to rotate, scroll/pinch to zoom.
 *
 * Two controls:
 *   - Marble TYPE (Calacatta / Nero Marquina / Emperador / Verde Alpi) —
 *     each renders a procedurally-generated veined texture (pure canvas,
 *     no image files, no network) so the viewer actually shows the range
 *     of stones the workshop offers.
 *   - FINISH (polished / matte / honed) — changes how the surface catches
 *     light (roughness + metalness).
 *
 * When the client provides real photos, swap makeMarbleTexture() for
 * new THREE.TextureLoader().load('/textures/<type>.jpg') — the rest of
 * the component stays the same.
 */

type Finish = 'polished' | 'matte' | 'honed';
type MarbleType = 'calacatta' | 'nero' | 'emperador' | 'verde';

const FINISH_PROPS: Record<Finish, { roughness: number; metalness: number; clearcoat?: number }> = {
  // Clearcoat is only really useful on the polished preset — a thin lacquer
  // reflection layer that makes gloss read at a glance. Matte/honed keep it
  // off so the surface stays convincingly dry.
  polished: { roughness: 0.06, metalness: 0.2,  clearcoat: 1 },
  matte:    { roughness: 0.7,  metalness: 0.02 },
  honed:    { roughness: 0.38, metalness: 0.05 },
};

// Palette per marble type: base stone color + vein colors + swatch dot.
const MARBLE: Record<MarbleType, { base: string; blotch: string; veins: string[]; swatch: string }> = {
  calacatta: { base: '#f1ede4', blotch: '#dcd6c8', veins: ['#8f8878', '#b3ab98'], swatch: '#efe9dd' },
  nero:      { base: '#141317', blotch: '#22212a', veins: ['#e9e7e2', '#b9b6ad'], swatch: '#17161c' },
  emperador: { base: '#4b3626', blotch: '#5d4531', veins: ['#c8a878', '#8f6b45'], swatch: '#573f2c' },
  verde:     { base: '#1f3a2c', blotch: '#27493a', veins: ['#a7cfb5', '#6f9d80'], swatch: '#264536' },
};

// A wandering vein line with occasional hairline branches.
function drawVein(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  opacity: number,
  width: number,
  rand: () => number
) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  let x = rand() * size;
  let y = -10;
  ctx.moveTo(x, y);
  let angle = Math.PI / 2 + (rand() - 0.5);
  while (y < size + 10) {
    angle += (rand() - 0.5) * 0.6;
    const step = 8 + rand() * 22;
    x += Math.cos(angle) * step;
    y += Math.abs(Math.sin(angle)) * step + 4;
    ctx.lineTo(x, y);
    // occasional hairline branch
    if (rand() > 0.9) {
      const bx = x + (rand() - 0.5) * 60;
      const by = y + (rand() - 0.5) * 60;
      ctx.moveTo(x, y);
      ctx.lineTo(bx, by);
      ctx.moveTo(x, y);
    }
  }
  ctx.stroke();
}

// Deterministic-ish PRNG so a given type always looks the same across
// re-renders (seeded by the type name's char codes).
function makeRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function makeMarbleTexture(type: MarbleType): CanvasTexture {
  const { base, blotch, veins } = MARBLE[type];
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rand = makeRand(type.split('').reduce((a, c) => a + c.charCodeAt(0), 7));

  // Base fill
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Soft cloudy tonal variation
  for (let i = 0; i < 60; i++) {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = blotch;
    const r = 30 + rand() * 130;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Primary veins (thicker, bolder)
  const majorVeins = 4 + Math.floor(rand() * 3);
  for (let v = 0; v < majorVeins; v++) {
    drawVein(ctx, size, veins[0], 0.5 + rand() * 0.3, 1.5 + rand() * 3, rand);
  }
  // Secondary veins (thin, subtle)
  const minorVeins = 8 + Math.floor(rand() * 6);
  for (let v = 0; v < minorVeins; v++) {
    drawVein(ctx, size, veins[1], 0.2 + rand() * 0.25, 0.5 + rand() * 1.2, rand);
  }

  ctx.globalAlpha = 1;
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  return tex;
}

const Slab: React.FC<{ type: MarbleType; finish: Finish; rotating: boolean }> = ({ type, finish, rotating }) => {
  const meshRef = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (rotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  // Regenerate texture only when the marble type changes.
  const texture = useMemo(() => makeMarbleTexture(type), [type]);

  // MeshPhysicalMaterial gives us a real clearcoat pass on polished finishes,
  // which sells "polished" vs "matte" much better than plain roughness alone.
  const material = useMemo(() => {
    const props = FINISH_PROPS[finish];
    return new MeshPhysicalMaterial({
      map: texture,
      roughness: props.roughness,
      metalness: props.metalness,
      clearcoat: props.clearcoat ?? 0,
      clearcoatRoughness: 0.1,
    });
  }, [texture, finish]);

  // Materials and textures leak GPU memory if not disposed on unmount.
  useEffect(() => {
    return () => {
      material.dispose();
      texture.dispose();
    };
  }, [material, texture]);

  return (
    <mesh ref={meshRef} material={material} castShadow>
      {/* Slab ~60x40x2 cm, scaled to the viewport */}
      <boxGeometry args={[3, 0.15, 2]} />
    </mesh>
  );
};

const MarbleExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [type, setType] = useState<MarbleType>('calacatta');
  const [finish, setFinish] = useState<Finish>('polished');
  const [rotating, setRotating] = useState(true);

  const types: Array<{ key: MarbleType; label: string }> = [
    { key: 'calacatta', label: t('explorer.type_calacatta') },
    { key: 'nero',      label: t('explorer.type_nero') },
    { key: 'emperador', label: t('explorer.type_emperador') },
    { key: 'verde',     label: t('explorer.type_verde') },
  ];

  const finishes: Array<{ key: Finish; label: string }> = [
    { key: 'polished', label: t('explorer.polished') },
    { key: 'matte',    label: t('explorer.matte') },
    { key: 'honed',    label: t('explorer.honed') },
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-neutral-900 to-black rounded-sm overflow-hidden border border-divider">
      <Canvas
        camera={{ position: [3, 2.5, 4], fov: 45 }}
        dpr={[1, 2]}
        shadows
        aria-label={t('explorer.canvas_label')}
      >
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 3, -2]} intensity={0.4} color="#b08d4b" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Slab type={type} finish={finish} rotating={rotating} />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={8} blur={2.5} far={2} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>

      {/* Marble TYPE swatches — top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-divider p-1.5 rounded-full">
        {types.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setType(m.key)}
            aria-pressed={type === m.key}
            aria-label={m.label}
            title={m.label}
            className={`w-7 h-7 rounded-full border-2 transition-all ${type === m.key ? 'border-accent scale-110' : 'border-white/20 hover:border-white/50'}`}
            style={{ backgroundColor: MARBLE[m.key].swatch }}
          />
        ))}
      </div>

      {/* Selected type name — below the swatches */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-widest text-light/80 pointer-events-none">
        {types.find((m) => m.key === type)?.label}
      </div>

      {/* FINISH switcher — bottom */}
      <div className="absolute bottom-4 start-4 end-4 md:end-auto md:start-4">
        <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md border border-divider p-1 rounded-full">
          {finishes.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFinish(f.key)}
              aria-pressed={finish === f.key}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition-colors ${
                finish === f.key ? 'bg-accent text-primary' : 'text-muted hover:text-light'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-rotate toggle — bottom end */}
      <button
        type="button"
        onClick={() => setRotating((v) => !v)}
        className="absolute bottom-4 end-4 hidden md:block px-3 py-1.5 text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-md border border-divider text-muted hover:text-light rounded-full transition-colors"
      >
        {rotating ? t('explorer.pause') : t('explorer.rotate')}
      </button>

      {/* Interaction hint — top start */}
      <div className="absolute top-4 start-4 text-[10px] uppercase tracking-widest text-muted/60 pointer-events-none max-w-[40%]">
        {t('explorer.hint')}
      </div>
    </div>
  );
};

export default MarbleExplorer;
