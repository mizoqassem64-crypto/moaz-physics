"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, BookOpen, Video, Award, Brain, Globe } from "lucide-react";

const stats = [
  { icon: <Users className="w-6 h-6" />, value: 12500, suffix: "+", label: "Active Students" },
  { icon: <Video className="w-6 h-6" />, value: 350, suffix: "+", label: "Video Lessons" },
  { icon: <BookOpen className="w-6 h-6" />, value: 85, suffix: "", label: "Physics Topics" },
  { icon: <Award className="w-6 h-6" />, value: 98, suffix: "%", label: "Success Rate" },
  { icon: <Brain className="w-6 h-6" />, value: 50, suffix: "+", label: "3D Simulations" },
  { icon: <Globe className="w-6 h-6" />, value: 45, suffix: "+", label: "Countries" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-space font-bold text-3xl md:text-4xl text-white">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
            <span className="gradient-text">Universe at Scale</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Numbers that define our cosmic reach
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 text-center hover-lift group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 text-neon-cyan mb-4 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}