"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hero3D } from "@/components/3d/hero-3d";
import { PhysicsCard } from "@/components/physics-card";
import { StatsSection } from "@/components/stats-section";
import { FeaturedVideos } from "@/components/featured-videos";
import { CosmicCharacters } from "@/components/cosmic-characters";
import { PricingSection } from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Atom, Orbit, Zap, BookOpen, Play, Star } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Hero3D />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Star className="w-4 h-4 text-neon-yellow" />
              <span className="text-sm text-neon-cyan font-space tracking-wider">
                DESIGNED BY MOAZ QASSEM
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-space font-bold mb-6"
          >
            <span className="gradient-text">QUANTUM</span>
            <br />
            <span className="text-white">& RELATIVITY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Journey through the fabric of spacetime. Master quantum mechanics and 
            Einstein's relativity with immersive 3D visualizations and expert guidance 
            from Moaz Qassem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/relativity">
              <Button
                size="lg"
                className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 hover:border-neon-blue px-8 py-6 text-lg font-space group"
              >
                Explore Relativity
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/quantum">
              <Button
                size="lg"
                variant="outline"
                className="border-neon-purple/50 text-neon-purple hover:bg-neon-purple/20 px-8 py-6 text-lg font-space"
              >
                <Atom className="mr-2 w-5 h-5" />
                Quantum Realm
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-neon-blue/50 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-neon-blue"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Cosmic Characters Section */}
      <CosmicCharacters />

      {/* Stats Section */}
      <StatsSection />

      {/* Physics Sections */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
              <span className="gradient-text">Explore the Universe</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Two fundamental pillars of modern physics, explained through interactive 
              3D experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <PhysicsCard
              title="Theory of Relativity"
              description="From special to general relativity, understand how gravity warps spacetime and why time is relative."
              icon={<Orbit className="w-8 h-8" />}
              href="/relativity"
              color="neon-blue"
              image="/images/relativity-hero.jpg"
            />
            <PhysicsCard
              title="Quantum Mechanics"
              description="Dive into the quantum world where particles exist in superposition and entanglement defies classical intuition."
              icon={<Atom className="w-8 h-8" />}
              href="/quantum"
              color="neon-purple"
              image="/images/quantum-hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <FeaturedVideos />

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-pink/10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center glass-strong rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-6">
            Ready to <span className="gradient-text">Unlock</span> the Universe?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students mastering physics with Moaz Qassem. 
            Start your journey today with our comprehensive video courses and interactive simulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-neon-blue hover:bg-neon-blue/80 text-black font-bold px-8 py-6 text-lg font-space"
              >
                <Zap className="mr-2 w-5 h-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/user/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-space"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                My Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}