import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, Html, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";

/* -------------------------------------------------------
   Uttarakhand Interactive Experience
   No external 3D assets are required for this prototype.
   Replace the procedural models with optimized .glb assets
   later if you want photorealistic architecture.
-------------------------------------------------------- */

function useBellAudio() {
  const audioRef = useRef(null);

  const ring = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = audioRef.current || new AudioContext();
    audioRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.35, now + 0.015);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    master.connect(ctx.destination);

    // Layered metallic partials for a temple-bell-like timbre.
    [196, 392, 588, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 2 ? "sine" : "triangle";
      osc.frequency.value = freq;
      gain.gain.value = [0.55, 0.28, 0.16, 0.09, 0.045][i];
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 3.3);
    });
  };

  return ring;
}

function Bell({ onRing }) {
  const group = useRef();
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = active ? Math.sin(state.clock.elapsedTime * 16) * 0.17 : 0;
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, target, 5, delta);
  });

  const ring = () => {
    setActive(true);
    onRing();
    setTimeout(() => setActive(false), 900);
  };

  return (
    <group ref={group} position={[0, 2.35, 0]} onClick={(e) => { e.stopPropagation(); ring(); }} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "default")}>
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.58, 0.72, 32]} />
        <meshStandardMaterial color="#b99042" metalness={0.8} roughness={0.23} />
      </mesh>
      <mesh position={[0, -0.42, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 12]} />
        <meshStandardMaterial color="#7a5925" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.35, 0.06, 16, 32]} />
        <meshStandardMaterial color="#caa35a" metalness={0.8} roughness={0.2} />
      </mesh>
      <Html center position={[0, 1.05, 0]}>
        <div className="bell-label">click the bell</div>
      </Html>
    </group>
  );
}

function Temple() {
  return (
    <group position={[0, -1.5, 0]}>
      <mesh receiveShadow castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[4.8, 0.35, 3.3]} />
        <meshStandardMaterial color="#a76d46" roughness={0.9} />
      </mesh>

      {/* Main sanctum */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[2.8, 2.0, 2.25]} />
        <meshStandardMaterial color="#caa47b" roughness={0.88} />
      </mesh>

      {/* Roof tiers */}
      <mesh castShadow position={[0, 2.35, 0]}>
        <coneGeometry args={[1.9, 1.15, 4]} />
        <meshStandardMaterial color="#806048" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 3.05, 0]}>
        <coneGeometry args={[1.25, 1.0, 4]} />
        <meshStandardMaterial color="#a6784f" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 3.7, 0]}>
        <coneGeometry args={[0.72, 0.85, 4]} />
        <meshStandardMaterial color="#8b6449" roughness={0.78} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.9, -1.16]}>
        <boxGeometry args={[0.72, 1.45, 0.08]} />
        <meshStandardMaterial color="#4e3425" roughness={0.75} />
      </mesh>

      {/* Steps */}
      {[0, 0.35, 0.7].map((z, i) => (
        <mesh key={z} position={[0, -0.05 + i * 0.08, -1.75 + z]}>
          <boxGeometry args={[2.2 - i * 0.22, 0.16, 0.42]} />
          <meshStandardMaterial color="#8d6a52" roughness={0.9} />
        </mesh>
      ))}

      {/* Bell support */}
      <mesh position={[0, 4.45, 0]}>
        <boxGeometry args={[0.18, 1.2, 0.18]} />
        <meshStandardMaterial color="#5d4737" />
      </mesh>
      <Bell onRing={() => {}} />
    </group>
  );
}

function HangingRopes() {
  const ropes = useMemo(() => [-2.7, -1.8, -0.9, 0.9, 1.8, 2.7], []);
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((line, i) => {
      line.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.025;
    });
  });

  return (
    <group ref={group}>
      {ropes.map((x, i) => (
        <mesh key={x} position={[x, 0.9, -0.25]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.08]}>
          <cylinderGeometry args={[0.018, 0.018, 4.5, 8]} />
          <meshStandardMaterial color="#d5c3a5" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function HimalayanTempleScene({ onBell }) {
  return (
    <>
      <color attach="background" args={["#dfe6e1"]} />
      <fog attach="fog" args={["#dfe6e1", 8, 22]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 8, 5]} intensity={3.0} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-5, 4, -3]} intensity={1.1} />
      <Float speed={0.55} rotationIntensity={0.04} floatIntensity={0.1}>
        <Temple />
      </Float>
      <HangingRopes />
      <Sparkles count={90} scale={[12, 8, 8]} size={1.2} speed={0.25} />
      <Environment preset="sunset" />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={13} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

function Flower({ position, bloom, onClick }) {
  const group = useRef();
  const target = bloom ? 1 : 0.12;

  useFrame((_, delta) => {
    if (!group.current) return;
    const scale = THREE.MathUtils.damp(group.current.scale.x, target, 5, delta);
    group.current.scale.setScalar(scale);
    group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group} position={position} scale={0.12} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.75, 8]} />
        <meshStandardMaterial color="#4c7143" />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.18, 0.72, Math.sin(a) * 0.18]} rotation={[0.3, 0, a]}>
            <sphereGeometry args={[0.16, 12, 8]} />
            <meshStandardMaterial color={i % 2 ? "#e9a7b9" : "#c88fb0"} roughness={0.65} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.09, 12, 8]} />
        <meshStandardMaterial color="#e5c66c" />
      </mesh>
    </group>
  );
}

function Mountain({ onSelect }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.025;
  });

  return (
    <group ref={group} onClick={(e) => { e.stopPropagation(); onSelect(); }} onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "default")}>
      <mesh position={[-2.5, 1.1, 0]} castShadow>
        <coneGeometry args={[3.1, 4.5, 5]} />
        <meshStandardMaterial color="#617867" roughness={1} />
      </mesh>
      <mesh position={[1.1, 1.35, -0.4]} castShadow>
        <coneGeometry args={[3.8, 5.3, 6]} />
        <meshStandardMaterial color="#526c61" roughness={1} />
      </mesh>
      <mesh position={[3.5, 0.9, 0.4]} castShadow>
        <coneGeometry args={[2.5, 3.8, 5]} />
        <meshStandardMaterial color="#718776" roughness={1} />
      </mesh>
      <mesh position={[0.4, 2.8, -0.5]}>
        <coneGeometry args={[1.15, 1.4, 5]} />
        <meshStandardMaterial color="#e8e9df" roughness={1} />
      </mesh>
      <Html center position={[1.0, 4.0, 0]}>
        <div className="mountain-label">click the mountain</div>
      </Html>
    </group>
  );
}

function ValleyScene({ bloomIds, setBloomIds }) {
  const flowers = useMemo(() => [
    [-3.3, -1.1, 0.6], [-2.4, -1.0, 1.0], [-1.3, -1.1, 0.7],
    [0.1, -1.05, 0.9], [1.1, -1.05, 0.6], [2.2, -1.05, 1.0], [3.2, -1.05, 0.65]
  ], []);

  const reveal = () => {
    setBloomIds(flowers.map((_, i) => i));
  };

  return (
    <>
      <color attach="background" args={["#dbe8dc"]} />
      <fog attach="fog" args={["#dbe8dc", 9, 24]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[-4, 8, 5]} intensity={2.5} castShadow />
      <Mountain onSelect={reveal} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#8da77b" roughness={1} />
      </mesh>
      {flowers.map((p, i) => (
        <Flower key={i} position={p} bloom={bloomIds.includes(i)} onClick={() => setBloomIds((ids) => ids.includes(i) ? ids.filter(x => x !== i) : [...ids, i])} />
      ))}
      <Sparkles count={110} scale={[13, 5, 9]} size={1.1} speed={0.18} />
      <Environment preset="forest" />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={14} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

function App() {
  const [scene, setScene] = useState("temple");
  const [bloomIds, setBloomIds] = useState([]);
  const ring = useBellAudio();

  return (
    <main>
      <header className="topbar">
        <div className="brand">UTTARAKHAND<span>·</span>IN MOTION</div>
        <nav>
          <button className={scene === "temple" ? "active" : ""} onClick={() => setScene("temple")}>Temple</button>
          <button className={scene === "valley" ? "active" : ""} onClick={() => setScene("valley")}>Valley of Flowers</button>
        </nav>
      </header>

      <section className="hero">
        <div className="copy">
          <p className="eyebrow">A DIGITAL JOURNEY THROUGH THE HIMALAYAS</p>
          <h1>{scene === "temple" ? <>Where the mountains<br/><em>remember.</em></> : <>Where the valley<br/><em>blooms.</em></>}</h1>
          <p className="lede">
            {scene === "temple"
              ? "Explore a Himalayan temple inspired by the quiet architecture, bells and sacred atmosphere of Uttarakhand."
              : "Discover a living valley. Touch the mountain to wake the buds, then open each flower one by one."}
          </p>
          <div className="hint">
            {scene === "temple" ? "Drag to look around · Click the bell" : "Drag to look around · Click the mountain · Click the buds"}
          </div>
        </div>

        <div className="canvas-wrap">
          <Canvas shadows camera={{ position: [0, 2.2, 9], fov: 43 }} dpr={[1, 1.7]}>
            <Suspense fallback={null}>
              {scene === "temple"
                ? <HimalayanTempleScene onBell={ring} />
                : <ValleyScene bloomIds={bloomIds} setBloomIds={setBloomIds} />}
            </Suspense>
          </Canvas>
        </div>
      </section>

      <footer className="footer">
        <span>UTTARAKHAND • INDIA</span>
        <span>Concept prototype for tourism storytelling</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
