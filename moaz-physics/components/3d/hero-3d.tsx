"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, MeshDistortMaterial, Sphere, Trail } from "@react-three/drei";
import * as THREE from "three";

function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x += 0.002;
    }
  });

  return (
    <group>
      {/* Event Horizon */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#000000"
          emissive="#1a0033"
          emissiveIntensity={2}
          distort={0.4}
          speed={2}
          roughness={0.2}
        />
      </mesh>

      {/* Accretion Disk */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.3, 32, 100]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff4500"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.1, 32, 100]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Particles */}
      <Particles count={200} />
    </group>
  );
}

function Particles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 4;
      temp.push({
        position: [Math.cos(t) * r, (Math.random() - 0.5) * 2, Math.sin(t) * r],
        speed: 0.5 + Math.random() * 1.5,
        scale: 0.02 + Math.random() * 0.04,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      const { position, speed } = particle;
      const time = state.clock.elapsedTime * speed;
      dummy.position.set(
        position[0] * Math.cos(time * 0.1) - position[2] * Math.sin(time * 0.1),
        position[1] + Math.sin(time + i) * 0.5,
        position[0] * Math.sin(time * 0.1) + position[2] * Math.cos(time * 0.1)
      );
      dummy.scale.setScalar(particle.scale * (1 + Math.sin(time * 2) * 0.3));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#00f3ff"
        emissive="#00f3ff"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}

function QuantumSphere() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[5, 0, -5]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshDistortMaterial
            color="#bc13fe"
            emissive="#bc13fe"
            emissiveIntensity={1.5}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="#bc13fe"
          emissive="#bc13fe"
          emissiveIntensity={0.5}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

function FloatingText() {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={textRef} position={[-5, 2, -3]}>
      <Float speed={1.5} rotationIntensity={0.3}>
        <mesh>
          <torusKnotGeometry args={[0.8, 0.2, 128, 32]} />
          <MeshDistortMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
            distort={0.3}
            speed={1.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#bc13fe" />
        <pointLight position={[0, 5, 0]} intensity={1.5} color="#ff6b35" />

        <BlackHole />
        <QuantumSphere />
        <FloatingText />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0.5}
          fade
          speed={1}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}