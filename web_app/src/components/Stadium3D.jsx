import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Sun, Moon, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// 1. Realistic Outfield Grass with Mown Concentric Stripe Patterns
function Outfield({ isNightMode }) {
  const stripeRings = useMemo(() => {
    const rings = [];
    const numRings = 10;
    const maxRadius = 45;
    for (let i = 0; i < numRings; i++) {
      const inner = (i / numRings) * maxRadius;
      const outer = ((i + 1) / numRings) * maxRadius;
      const color = isNightMode 
        ? (i % 2 === 0 ? '#0b381a' : '#0f4824')
        : (i % 2 === 0 ? '#15803d' : '#166534');
      rings.push({ inner, outer, color });
    }
    return rings;
  }, [isNightMode]);

  return (
    <group position={[0, -0.05, 0]}>
      {/* Concentric Mown Grass Stripes */}
      {stripeRings.map((ring, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <ringGeometry args={[ring.inner, ring.outer, 64]} />
          <meshStandardMaterial color={ring.color} roughness={0.7} />
        </mesh>
      ))}

      {/* Boundary Line & Rope Padding */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[43.8, 44.2, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      
      {/* Boundary Foam Tobbler Cylinders */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <torusGeometry args={[44, 0.15, 8, 64]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.5} />
      </mesh>

      {/* 30-Yard Infield Restriction Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[22, 22.25, 64]} />
        <meshBasicMaterial color="rgba(255, 255, 255, 0.4)" transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 2. 3D Player Models: Batter (Striker), Non-Striker, Bowler, and Wicketkeeper

// Batter on Striker End
function BatterStriker({ position = [0.3, 0, 8.8] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 6, 0]}>
      {/* Pads (Legs) */}
      <mesh position={[-0.15, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Torso / Batting Jersey */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.25]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.28, 0.95, 0.15]} rotation={[0.4, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.45]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0.22, 0.9, 0.2]} rotation={[0.6, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.45]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Helmet & Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Helmet Visor */}
      <mesh position={[0, 1.48, 0.12]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" metalness={0.9} />
      </mesh>

      {/* 3D Cricket Bat */}
      <group position={[0.25, 0.55, 0.25]} rotation={[-0.3, 0.2, -0.4]}>
        {/* Bat Blade */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.65, 0.04]} />
          <meshStandardMaterial color="#d97706" roughness={0.6} />
        </mesh>
        {/* Bat Handle */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

// Batter on Non-Striker End
function NonStrikerBatter({ position = [0.8, 0, -8.6] }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Pads */}
      <mesh position={[-0.12, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.12, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.25]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>

      {/* Bat resting on ground */}
      <mesh position={[0.25, 0.35, 0.2]} rotation={[0.1, 0, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.7, 0.04]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
    </group>
  );
}

// Bowler on Bowling End
function Bowler({ position = [0, 0, -10.8] }) {
  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Legs in delivery stride */}
      <mesh position={[-0.15, 0.45, 0.2]} rotation={[-0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.9]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.15, 0.45, -0.2]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.9]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Bowling Jersey */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.26]} />
        <meshStandardMaterial color="#7e22ce" />
      </mesh>

      {/* Bowling Arm raised */}
      <mesh position={[0.28, 1.4, 0.1]} rotation={[-1.2, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.55]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[-0.28, 1.0, -0.2]} rotation={[0.6, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Head & Cap */}
      <mesh position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0, 1.6, 0.05]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.18, 0.04, 0.18]} />
        <meshStandardMaterial color="#581c87" />
      </mesh>
    </group>
  );
}

// Wicketkeeper behind striker stumps
function Wicketkeeper({ position = [0, 0, 11.3] }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Crouched Legs */}
      <mesh position={[-0.2, 0.3, 0]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 0.3, 0]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.75, 0]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.5, 0.25]} />
        <meshStandardMaterial color="#7e22ce" />
      </mesh>

      {/* Keeper Gloves */}
      <mesh position={[-0.25, 0.7, 0.25]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      <mesh position={[0.25, 0.7, 0.25]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 1.15, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#581c87" />
      </mesh>
    </group>
  );
}

// 3. High-Detail Cricket Pitch, Crease Markings & Wooden Stumps
function Pitch() {
  return (
    <group position={[0, 0, 0]}>
      {/* Pitch Soil / Clay Rectangle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[3.2, 20.12]} />
        <meshStandardMaterial color="#c2a679" roughness={0.9} />
      </mesh>

      {/* Pitch Footmark / Wearing Patches */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.022, 8.2]}>
        <circleGeometry args={[0.6, 16]} />
        <meshStandardMaterial color="#a3885c" roughness={1.0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.022, -8.2]}>
        <circleGeometry args={[0.6, 16]} />
        <meshStandardMaterial color="#a3885c" roughness={1.0} />
      </mesh>

      {/* Batting & Bowling Crease Lines */}
      {/* Popping Creases */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 8.8]}>
        <planeGeometry args={[2.8, 0.08]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -8.8]}>
        <planeGeometry args={[2.8, 0.08]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Bowling Crease Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 10.0]}>
        <planeGeometry args={[2.6, 0.08]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -10.0]}>
        <planeGeometry args={[2.6, 0.08]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Return Crease Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.32, 0.03, 9.4]}>
        <planeGeometry args={[0.08, 1.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.32, 0.03, 9.4]}>
        <planeGeometry args={[0.08, 1.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.32, 0.03, -9.4]}>
        <planeGeometry args={[0.08, 1.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.32, 0.03, -9.4]}>
        <planeGeometry args={[0.08, 1.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3D Wooden Stumps with LED Bails (End 1 - Striker) */}
      <group position={[0, 0.38, 10.0]}>
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.72]} />
            <meshStandardMaterial color="#854d0e" roughness={0.3} metalness={0.1} />
          </mesh>
        ))}
        {/* LED Glowing Bails */}
        <mesh position={[0, 0.37, 0]}>
          <boxGeometry args={[0.36, 0.04, 0.04]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 3D Wooden Stumps with LED Bails (End 2 - Non-Striker) */}
      <group position={[0, 0.38, -10.0]}>
        {[-0.15, 0, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.72]} />
            <meshStandardMaterial color="#854d0e" roughness={0.3} metalness={0.1} />
          </mesh>
        ))}
        {/* LED Glowing Bails */}
        <mesh position={[0, 0.37, 0]}>
          <boxGeometry args={[0.36, 0.04, 0.04]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 3D PLAYERS ON PITCH */}
      {/* 1. Batter on Striker End */}
      <BatterStriker position={[0.3, 0, 8.8]} />

      {/* 2. Non-Striker Batter at Non-Striker End */}
      <NonStrikerBatter position={[0.8, 0, -8.6]} />

      {/* 3. Bowler at Bowling End */}
      <Bowler position={[0, 0, -10.8]} />

      {/* 4. Wicketkeeper behind Striker Stumps */}
      <Wicketkeeper position={[0, 0, 11.3]} />
    </group>
  );
}

// 4. Multi-tiered Stadium Seating Stands Ring & Canopy Roof
function StadiumStands({ isNightMode }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Lower Seating Tier */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
        <ringGeometry args={[46, 54, 64]} />
        <meshStandardMaterial color={isNightMode ? "#1e293b" : "#334155"} roughness={0.7} />
      </mesh>
      {/* Upper Seating Tier */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 7.5, 0]}>
        <ringGeometry args={[54.5, 64, 64]} />
        <meshStandardMaterial color={isNightMode ? "#0f172a" : "#1e293b"} roughness={0.7} />
      </mesh>

      {/* Stadium Wall Barrier */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[64, 64.5, 12, 64, 1, true]} />
        <meshStandardMaterial color="#475569" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Stadium Top Canopy Roof Ring */}
      <mesh position={[0, 14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[50, 68, 64]} />
        <meshStandardMaterial color={isNightMode ? "#1e293b" : "#475569"} roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 5. Floodlight Tower Component (Active in Night mode)
function LatticeFloodlight({ position, angle = 0, isNightMode }) {
  return (
    <group position={position} rotation={[0, angle, 0]}>
      {/* Main Steel Framework Column */}
      <mesh position={[0, 16, 0]} castShadow>
        <cylinderGeometry args={[0.5, 1.2, 32, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top Floodlight Panel Array Header */}
      <mesh position={[0, 32, 0]}>
        <boxGeometry args={[6, 3.5, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* LED Bulbs Grid */}
      <mesh position={[0, 32, 0.41]}>
        <planeGeometry args={[5.6, 3.1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={isNightMode ? 3.0 : 0.2} 
        />
      </mesh>

      {/* Intense Spot Light towards pitch (Active at Night) */}
      {isNightMode && (
        <spotLight
          position={[0, 32, 0]}
          target-position={[0, 0, 0]}
          intensity={3.5}
          angle={0.65}
          penumbra={0.4}
          color="#e0f2fe"
          castShadow
        />
      )}
    </group>
  );
}

// 6. Animated 3D Leather Cricket Ball
function AnimatedBall({ curve, active }) {
  const ballRef = useRef();

  useFrame(({ clock }) => {
    if (ballRef.current && curve && active) {
      const t = (clock.getElapsedTime() * 0.4) % 1;
      const point = curve.getPoint(t);
      ballRef.current.position.set(point.x, point.y, point.z);
    }
  });

  if (!active || !curve) return null;

  return (
    <mesh ref={ballRef} castShadow>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

// 7. 3D Shot Trajectory Curves
function ShotTrajectories({ showPowerplay, showDeathOvers, activeShotIdx }) {
  const trajectories = useMemo(() => {
    const list = [];
    if (showPowerplay) {
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 1.8 - 0.4;
        const dist = 32 + (i % 3) * 3.5;
        const height = 4 + (i % 3) * 2;

        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 0.4, 8.8),
          new THREE.Vector3(Math.sin(angle) * dist * 0.5, height, Math.cos(angle) * dist * 0.5 + 4),
          new THREE.Vector3(Math.sin(angle) * dist, 0.1, Math.cos(angle) * dist)
        );
        list.push({ curve, phase: 'powerplay' });
      }
    }

    if (showDeathOvers) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + 0.15;
        const dist = 43 + (i % 2) * 2;
        const height = 13 + (i % 4) * 3;

        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 0.4, 8.8),
          new THREE.Vector3(Math.sin(angle) * dist * 0.5, height, Math.cos(angle) * dist * 0.5 + 4),
          new THREE.Vector3(Math.sin(angle) * dist, 0.1, Math.cos(angle) * dist)
        );
        list.push({ curve, phase: 'death' });
      }
    }
    return list;
  }, [showPowerplay, showDeathOvers]);

  const activeCurve = trajectories[activeShotIdx % (trajectories.length || 1)]?.curve;

  return (
    <group>
      {trajectories.map((traj, idx) => {
        const points = traj.curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const color = traj.phase === 'powerplay' ? '#0284c7' : '#e11d48';
        const opacity = idx === activeShotIdx % trajectories.length ? 1.0 : 0.45;

        return (
          <line key={idx} geometry={geometry}>
            <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} linewidth={2} />
          </line>
        );
      })}

      <AnimatedBall curve={activeCurve} active={trajectories.length > 0} />
    </group>
  );
}

// 8. Dynamic Camera Manager with Smooth Drag Zooming
function CameraController({ cameraMode, zoomFactor }) {
  const { camera } = useThree();

  useFrame(() => {
    let targetPos = [28, 32, 44];
    switch (cameraMode) {
      case 'top': targetPos = [0, 75, 0.1]; break;
      case 'batsman': targetPos = [0, 2.4, 12.5]; break;
      case 'bowler': targetPos = [0, 3.5, -16]; break;
      case 'pitch': targetPos = [0, 4.5, 18]; break;
      default: targetPos = [28, 32, 44]; break;
    }

    const scaledPos = targetPos.map((coord) => coord * zoomFactor);
    camera.position.lerp(new THREE.Vector3(...scaledPos), 0.05);
  });

  return null;
}

export default function Stadium3D() {
  const [cameraMode, setCameraMode] = useState('orbit');
  const [isNightMode, setIsNightMode] = useState(true);
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [showPowerplay, setShowPowerplay] = useState(true);
  const [showDeathOvers, setShowDeathOvers] = useState(true);
  const [activeShotIdx, setActiveShotIdx] = useState(0);

  const handleZoomIn = () => setZoomFactor((prev) => Math.max(0.4, prev - 0.15));
  const handleZoomOut = () => setZoomFactor((prev) => Math.min(2.0, prev + 0.15));
  const handleResetZoom = () => setZoomFactor(1.0);

  return (
    <div className={`relative w-full h-[580px] rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-2xl transition-all duration-500 ${
      isNightMode ? 'bg-[#07090e]' : 'bg-[#e0f2fe]'
    }`}>
      
      {/* Top Left: Camera Controls & Zoom Options */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 glass-panel p-2 rounded-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 px-2 py-1 flex items-center">
            Camera:
          </span>
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraMode === 'orbit' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Free Orbit
          </button>
          <button
            onClick={() => setCameraMode('top')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraMode === 'top' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Top Tactical
          </button>
          <button
            onClick={() => setCameraMode('batsman')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraMode === 'batsman' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Batsman
          </button>
          <button
            onClick={() => setCameraMode('bowler')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraMode === 'bowler' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Bowler
          </button>
          <button
            onClick={() => setCameraMode('pitch')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraMode === 'pitch' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pitch Zoom
          </button>
        </div>

        {/* Drag / Zoom In / Zoom Out Toolbar */}
        <div className="flex items-center gap-2 glass-panel p-2 rounded-xl w-fit">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 px-2 flex items-center gap-1">
            Zoom:
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In (Drag Closer)"
            className="p-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-black rounded-lg text-slate-200 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out (Drag Away)"
            className="p-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-black rounded-lg text-slate-200 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom Level"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="0.4"
            max="2.0"
            step="0.05"
            value={zoomFactor}
            onChange={(e) => setZoomFactor(parseFloat(e.target.value))}
            className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>
      </div>

      {/* Top Right: Day/Night Mode & Shot Toggles */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2">
        {/* Day / Night Atmosphere Toggle */}
        <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setIsNightMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              !isNightMode ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/30' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" /> Day ☀️
          </button>
          <button
            onClick={() => setIsNightMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isNightMode ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Moon className="w-4 h-4" /> Night 🌙
          </button>
        </div>

        {/* Shot Trajectory Controls */}
        <div className="glass-panel p-2 rounded-xl flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300 px-1">
            <input
              type="checkbox"
              checked={showPowerplay}
              onChange={(e) => setShowPowerplay(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Powerplay</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300 px-1">
            <input
              type="checkbox"
              checked={showDeathOvers}
              onChange={(e) => setShowDeathOvers(e.target.checked)}
              className="accent-rose-500 rounded"
            />
            <span>Death 6s</span>
          </label>
          <button
            onClick={() => setActiveShotIdx((prev) => prev + 1)}
            className="px-3 py-1 text-xs font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
          >
            Next Shot 🏏
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <CameraController cameraMode={cameraMode} zoomFactor={zoomFactor} />
        
        {/* Atmosphere Lighting (Day vs Night) */}
        {isNightMode ? (
          <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[20, 50, 20]} intensity={0.8} castShadow />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          </>
        ) : (
          <>
            <ambientLight intensity={0.75} />
            <directionalLight 
              position={[40, 80, 40]} 
              intensity={2.2} 
              color="#fffbeb" 
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
          </>
        )}

        {/* 4 Corner Lattice Floodlight Towers */}
        <LatticeFloodlight position={[-42, 0, -42]} angle={Math.PI / 4} isNightMode={isNightMode} />
        <LatticeFloodlight position={[42, 0, -42]} angle={-Math.PI / 4} isNightMode={isNightMode} />
        <LatticeFloodlight position={[-42, 0, 42]} angle={(3 * Math.PI) / 4} isNightMode={isNightMode} />
        <LatticeFloodlight position={[42, 0, 42]} angle={-(3 * Math.PI) / 4} isNightMode={isNightMode} />

        {/* Realistic Outfield with Concentric Mown Stripes */}
        <Outfield isNightMode={isNightMode} />

        {/* Detailed Cricket Pitch, Creases & Stumps with 3D Player Models */}
        <Pitch />

        {/* Multi-tier Seating Stands */}
        <StadiumStands isNightMode={isNightMode} />

        {/* 3D Shot Trajectory Arcs & Animated Cricket Ball */}
        <ShotTrajectories
          showPowerplay={showPowerplay}
          showDeathOvers={showDeathOvers}
          activeShotIdx={activeShotIdx}
        />

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={10} 
          maxDistance={100} 
          maxPolarAngle={Math.PI / 2.05} 
          dampingFactor={0.05} 
        />
      </Canvas>

      {/* Bottom Information overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center text-xs text-slate-300 glass-panel px-4 py-2.5 rounded-xl pointer-events-none">
        <span className="flex items-center gap-2">
          <span>🏏 3D On-Field Players: Batter (Striker), Non-Striker, Bowler & Wicketkeeper</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono">{isNightMode ? 'Night Mode' : 'Day Mode'}</span>
        </span>
        <span className="text-cyan-400 font-mono">* Interactive 3D Match Situation Simulation</span>
      </div>
    </div>
  );
}
