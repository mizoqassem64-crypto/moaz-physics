"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Rocket, Globe, Atom } from "lucide-react";

const characters = [
  {
    name: "Cosmo Explorer",
    role: "Relativity Guide",
    image: "https://images.unsplash.com/photo-1614730341194-75c60740a2d3?w=400&h=400&fit=crop",
    icon: <Rocket className="w-6 h-6" />,
    color: "from-neon-blue to-cyan-400",
    description: "Guides you through spacetime curvature",
  },
  {
    name: "Quantum Quark",
    role: "Quantum Companion",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop",
    icon: <Atom className="w-6 h-6" />,
    color: "from-neon-purple to-pink-400",
    description: "Explains superposition and entanglement",
  },
  {
    name: "Nebula Navigator",
    role: "Universe Mapper",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    icon: <Globe className="w-6 h-6" />,
    color: "from-neon-pink to-rose-400",
    description: "Maps the cosmic web of galaxies",
  },
  {
    name: "Star Sage",
    role: "Energy Master",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=400&fit=crop",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-neon-green to-emerald-400",
    description: "Teaches energy-mass equivalence",
  },
];

export function CosmicCharacters() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
            Meet Your <span className="gradient-text">Cosmic Guides</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Animated 3D characters that make learning physics an intergalactic adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {characters.map((char, index) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ 
                y: -15, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <div className="relative glass rounded-2xl p-6 overflow-hidden hover-lift">
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${char.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />

                <div className="relative z-10">
                  {/* Character Image with floating animation */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className="relative w-32 h-32 mx-auto mb-4"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${char.color} rounded-full opacity-20 blur-lg`} />
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="rounded-full object-cover border-2 border-white/20"
                    />
                    <div className={`absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br ${char.color} text-white`}>
                      {char.icon}
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-space font-bold text-white mb-1 text-center">
                    {char.name}
                  </h3>
                  <p className={`text-sm font-medium bg-gradient-to-r ${char.color} bg-clip-text text-transparent text-center mb-2`}>
                    {char.role}
                  </p>
                  <p className="text-gray-400 text-sm text-center">
                    {char.description}
                  </p>

                  {/* Animated rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-4 right-4 w-8 h-8 border border-white/10 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-6 right-6 w-4 h-4 border border-white/5 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
