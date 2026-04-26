import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a2e",
          600: "#16213e",
          500: "#0f3460",
          400: "#e94560",
          300: "#ff6b6b",
          200: "#ffd93d",
          100: "#6bcb77",
        },
        neon: {
          blue: "#00f3ff",
          purple: "#bc13fe",
          pink: "#ff00ff",
          green: "#00ff88",
          cyan: "#00ffff",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        space: ["Orbitron", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "orbit": "orbit 10s linear infinite",
        "warp": "warp 3s ease-in-out infinite",
        "glitch": "glitch 1s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 243, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 243, 255, 0.6)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
        },
        warp: {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.1) rotate(180deg)", opacity: "0.8" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "1" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "space-gradient": "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)",
        "neon-gradient": "linear-gradient(135deg, #00f3ff 0%, #bc13fe 50%, #ff00ff 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;