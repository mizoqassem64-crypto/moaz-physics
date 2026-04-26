"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { ArrowRight, Atom, Waves, Eye, Network, ChevronDown } from "lucide-react";
import Link from "next/link";

function QuantumField() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[Math.sin(i * 1.2) * 3, Math.cos(i * 1.5) * 2, 0]}>
            <sphereGeometry args={[0.3 + i * 0.1, 32, 32]} />
            <MeshDistortMaterial
              color={i % 2 === 0 ? "#bc13fe" : "#ff00ff"}
              emissive={i % 2 === 0 ? "#bc13fe" : "#ff00ff"}
              emissiveIntensity={2}
              distort={0.4}
              speed={2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
      {/* Orbital paths */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`orbit-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2 + i * 1.5, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#bc13fe"
            emissive="#bc13fe"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function QuantumPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const topics = [
    {
      title: "Wave-Particle Duality",
      description: "How quantum objects behave as both particles and waves, challenging classical intuition.",
      icon: <Waves className="w-8 h-8" />,
      color: "neon-purple",
    },
    {
      title: "Quantum Superposition",
      description: "Particles existing in multiple states simultaneously until observed.",
      icon: <Eye className="w-8 h-8" />,
      color: "neon-pink",
    },
    {
      title: "Quantum Entanglement",
      description: "Spooky action at a distance - connected particles across the universe.",
      icon: <Network className="w-8 h-8" />,
      color: "neon-blue",
    },
    {
      title: "Quantum Tunneling",
      description: "Particles passing through barriers they classically shouldn't overcome.",
      icon: <Atom className="w-8 h-8" />,
      color: "neon-green",
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#bc13fe" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
            <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
            <QuantumField />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-space font-bold mb-6">
              <span className="gradient-text">QUANTUM</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          >
            Dive into the subatomic realm where probability rules and reality 
            is stranger than fiction. Welcome to quantum mechanics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="#quantum-topics">
              <Button
                size="lg"
                className="bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/50 font-space"
              >
                Explore Quantum Realm
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      <section id="quantum-topics" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
              Quantum <span className="gradient-text">Phenomena</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the bizarre and beautiful behaviors of the quantum world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-8 border border-white/10 hover:border-neon-purple/30 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${topic.color}/20 text-${topic.color} mb-6 group-hover:scale-110 transition-transform`}>
                  {topic.icon}
                </div>
                <h3 className="text-2xl font-space font-bold text-white mb-3">
                  {topic.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {topic.description}
                </p>
                <Link href="/user/dashboard">
                  <Button variant="ghost" className="text-neon-purple hover:bg-neon-purple/10 p-0">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-neon-blue/5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 text-center border border-neon-purple/20"
          >
            <h2 className="text-4xl font-space font-bold text-white mb-4">
              Enter the <span className="gradient-text">Quantum Realm</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Uncertainty, superposition, and entanglement await. 
              Begin your quantum journey with Moaz Qassem today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/dashboard">
                <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white font-bold px-8 py-6 text-lg font-space">
                  <Atom className="mr-2 w-5 h-5" />
                  Start Learning
                </Button>
              </Link>
              <Link href="/relativity">
                <Button variant="outline" className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20 px-8 py-6 text-lg font-space">
                  Explore Relativity
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}