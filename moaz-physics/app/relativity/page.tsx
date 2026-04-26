"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Ruler, Zap, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";

function WarpedGrid() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <meshStandardMaterial
        color="#0a0a0f"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function SpacetimeSphere() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function RelativityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const topics = [
    {
      title: "Special Relativity",
      description: "Time dilation, length contraction, and the speed of light as the cosmic speed limit.",
      icon: <Clock className="w-8 h-8" />,
      color: "neon-blue",
    },
    {
      title: "General Relativity",
      description: "Gravity as curvature of spacetime, black holes, and gravitational waves.",
      icon: <Globe className="w-8 h-8" />,
      color: "neon-purple",
    },
    {
      title: "Spacetime Geometry",
      description: "The Minkowski metric, world lines, and the geometry of the universe.",
      icon: <Ruler className="w-8 h-8" />,
      color: "neon-pink",
    },
    {
      title: "Relativistic Energy",
      description: "E=mc², mass-energy equivalence, and relativistic momentum.",
      icon: <Zap className="w-8 h-8" />,
      color: "neon-green",
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00f3ff" />
            <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
            <WarpedGrid />
            <SpacetimeSphere />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-space font-bold mb-6">
              <span className="gradient-text">RELATIVITY</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          >
            Where time bends and space curves. Understand how Einstein revolutionized 
            our understanding of gravity and the fabric of the cosmos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="#topics">
              <Button
                size="lg"
                className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 font-space"
              >
                Explore Topics
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
              Core <span className="gradient-text">Concepts</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Master the fundamental principles that govern space, time, and gravity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-8 border border-white/10 hover:border-neon-blue/30 transition-all group"
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
                  <Button variant="ghost" className="text-neon-blue hover:bg-neon-blue/10 p-0">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 text-center border border-neon-blue/20"
          >
            <h2 className="text-4xl font-space font-bold text-white mb-4">
              Ready to Bend <span className="gradient-text">Spacetime?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Start your journey through Einstein's universe with interactive 
              simulations and expert guidance from Moaz Qassem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/user/dashboard">
                <Button className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold px-8 py-6 text-lg font-space">
                  <Zap className="mr-2 w-5 h-5" />
                  Start Learning
                </Button>
              </Link>
              <Link href="/quantum">
                <Button variant="outline" className="border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20 px-8 py-6 text-lg font-space">
                  Explore Quantum
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}