import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import type { Mesh } from 'three';
import { MeshStandardMaterial } from 'three';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Interactive 3D marble slab. Drag to rotate, scroll/pinch to zoom.
 * Users can toggle between three surface finishes (polished, matte, honed)
 * to see how the same material behaves under different treatments.
 *
 * Everything Three.js imports here is inside this file — the parent lazy()s
 * this component so nothing runs (or downloads) until the user actively
 * opens the explorer.
 */

type Finish = 'polished' | 'matte' | 'honed';

const FINISH_PROPS: Record<Finish, { roughness: number; metalness: number; clearcoat?: number }> = {
  polished: { roughness: 0.08, metalness: 0.15, clearcoat: 1 },
  matte:    { roughness: 0.55, metalness: 0.05 },
  honed:    { roughness: 0.32, metalness: 0.02 },
};

const Slab: React.FC<{ finish: Finish; rotating: boolean }> = ({ finish, rotating }) => {
  const meshRef = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (rotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  const props = FINISH_PROPS[finish];
  const material = new MeshStandardMaterial({
    color: '#e8e4dc',
    roughness: props.roughness,
    metalness: props.metalness,
  });

  return (
    <mesh ref={meshRef} material={material} castShadow>
      {/* Slab dimensions roughly 60x40x2 cm, scaled to fit the viewport */}
      <boxGeometry args={[3, 0.15, 2]} />
    </mesh>
  );
};

const MarbleExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [finish, setFinish] = useState<Finish>('polished');
  const [rotating, setRotating] = useState(true);

  const finishes: Array<{ key: Finish; label: string }> = [
    { key: 'polished', label: t('explorer.polished') },
    { key: 'matte',    label: t('explorer.matte') },
    { key: 'honed',    label: t('explorer.honed') },
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-neutral-900 to-black rounded-sm overflow-hidden border border-neutral-800">
      <Canvas
        camera={{ position: [3, 2.5, 4], fov: 45 }}
        dpr={[1, 2]}
        shadows
        aria-label={t('explorer.canvas_label')}
      >
        <color attach="background" args={['#0a0a0a']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 3, -2]} intensity={0.4} color="#b08d4b" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Slab finish={finish} rotating={rotating} />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={8} blur={2.5} far={2} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>

      {/* Finish switcher */}
      <div className="absolute bottom-4 start-4 end-4 md:end-auto md:start-4">
        <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md border border-neutral-800 p-1 rounded-full">
          {finishes.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFinish(f.key)}
              aria-pressed={finish === f.key}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition-colors ${
                finish === f.key
                  ? 'bg-accent text-primary'
                  : 'text-muted hover:text-light'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-rotate toggle */}
      <button
        type="button"
        onClick={() => setRotating((v) => !v)}
        className="absolute top-4 end-4 px-3 py-1.5 text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-md border border-neutral-800 text-muted hover:text-light rounded-full transition-colors"
      >
        {rotating ? t('explorer.pause') : t('explorer.rotate')}
      </button>

      {/* Interaction hint */}
      <div className="absolute top-4 start-4 text-[10px] uppercase tracking-widest text-muted/60 pointer-events-none">
        {t('explorer.hint')}
      </div>
    </div>
  );
};

export default MarbleExplorer;
