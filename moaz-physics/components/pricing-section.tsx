"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Explorer",
    icon: <Rocket className="w-6 h-6" />,
    price: 0,
    period: "forever",
    description: "Start your physics journey",
    features: [
      "5 free video lessons",
      "Basic 3D simulations",
      "Community access",
      "Mobile app access",
    ],
    cta: "Get Started",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Physicist",
    icon: <Zap className="w-6 h-6" />,
    price: 19.99,
    period: "month",
    description: "Master quantum & relativity",
    features: [
      "Unlimited video access",
      "Advanced 3D simulations",
      "Downloadable resources",
      "Progress tracking",
      "Certificate of completion",
      "Priority support",
    ],
    cta: "Subscribe Now",
    href: "/api/payments/checkout?plan=physicist",
    popular: true,
  },
  {
    name: "Cosmic",
    icon: <Crown className="w-6 h-6" />,
    price: 49.99,
    period: "month",
    description: "For serious researchers",
    features: [
      "Everything in Physicist",
      "1-on-1 mentoring with Moaz",
      "Research paper access",
      "Custom simulations",
      "API access",
      "White-label options",
    ],
    cta: "Go Cosmic",
    href: "/api/payments/checkout?plan=cosmic",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
            Choose Your <span className="gradient-text">Path</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Flexible plans designed for every level of cosmic curiosity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-neon-blue/20 to-neon-purple/20 border-2 border-neon-blue/50"
                  : "glass border border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon-blue text-black text-sm font-bold font-space">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                  plan.popular 
                    ? "bg-neon-blue/20 text-neon-blue" 
                    : "bg-white/5 text-gray-400"
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-space font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <span className="text-5xl font-space font-bold text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className={`w-5 h-5 ${plan.popular ? "text-neon-blue" : "text-neon-green"}`} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <Button
                  className={`w-full py-6 text-lg font-space ${
                    plan.popular
                      ? "bg-neon-blue hover:bg-neon-blue/80 text-black font-bold"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/20"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}