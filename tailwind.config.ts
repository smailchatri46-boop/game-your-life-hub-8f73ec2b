import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          dark: "hsl(var(--primary-dark))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        journal: {
          orange: "hsl(var(--journal-orange))",
          yellow: "hsl(var(--journal-yellow))",
          green: "hsl(var(--journal-green))",
          purple: "hsl(var(--journal-purple))",
          pink: "hsl(var(--journal-pink))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        large: "var(--shadow-large)",
        glass: "var(--glass-shadow)",
        glow: "var(--glass-glow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Glow pulse for ambient background
        "glowPulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.12)", opacity: "1" },
        },
        // Main organic blob morph - dramatic border-radius changes
        "organicMorph1": {
          "0%": { 
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            transform: "rotate(0deg) scale(1)"
          },
          "14%": { 
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            transform: "rotate(5deg) scale(1.02)"
          },
          "28%": { 
            borderRadius: "70% 30% 50% 50% / 30% 30% 70% 70%",
            transform: "rotate(-3deg) scale(0.98)"
          },
          "42%": { 
            borderRadius: "30% 70% 40% 60% / 50% 60% 30% 60%",
            transform: "rotate(8deg) scale(1.03)"
          },
          "56%": { 
            borderRadius: "55% 45% 65% 35% / 35% 55% 45% 55%",
            transform: "rotate(-5deg) scale(0.97)"
          },
          "70%": { 
            borderRadius: "35% 65% 35% 65% / 65% 35% 65% 35%",
            transform: "rotate(4deg) scale(1.01)"
          },
          "84%": { 
            borderRadius: "50% 50% 25% 75% / 45% 65% 45% 55%",
            transform: "rotate(-6deg) scale(0.99)"
          },
          "100%": { 
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            transform: "rotate(0deg) scale(1)"
          },
        },
        // Secondary blob morph - offset timing
        "organicMorph2": {
          "0%": { 
            borderRadius: "40% 60% 55% 45% / 55% 45% 50% 50%",
            transform: "rotate(5deg) scale(1)"
          },
          "16%": { 
            borderRadius: "65% 35% 40% 60% / 35% 65% 40% 60%",
            transform: "rotate(-4deg) scale(1.04)"
          },
          "33%": { 
            borderRadius: "50% 50% 60% 40% / 60% 40% 50% 50%",
            transform: "rotate(7deg) scale(0.96)"
          },
          "50%": { 
            borderRadius: "35% 65% 35% 65% / 45% 55% 65% 35%",
            transform: "rotate(-6deg) scale(1.02)"
          },
          "66%": { 
            borderRadius: "60% 40% 45% 55% / 50% 60% 35% 65%",
            transform: "rotate(3deg) scale(0.98)"
          },
          "83%": { 
            borderRadius: "45% 55% 55% 45% / 40% 50% 55% 45%",
            transform: "rotate(-8deg) scale(1.03)"
          },
          "100%": { 
            borderRadius: "40% 60% 55% 45% / 55% 45% 50% 50%",
            transform: "rotate(5deg) scale(1)"
          },
        },
        // Inner core morph
        "organicMorph3": {
          "0%": { 
            borderRadius: "50% 50% 40% 60% / 40% 60% 45% 55%",
            transform: "translate(0, 0) rotate(0deg)"
          },
          "25%": { 
            borderRadius: "60% 40% 55% 45% / 55% 45% 60% 40%",
            transform: "translate(5%, -3%) rotate(6deg)"
          },
          "50%": { 
            borderRadius: "45% 55% 45% 55% / 45% 55% 40% 60%",
            transform: "translate(-4%, 5%) rotate(-4deg)"
          },
          "75%": { 
            borderRadius: "55% 45% 60% 40% / 60% 40% 55% 45%",
            transform: "translate(3%, -4%) rotate(5deg)"
          },
          "100%": { 
            borderRadius: "50% 50% 40% 60% / 40% 60% 45% 55%",
            transform: "translate(0, 0) rotate(0deg)"
          },
        },
        // Highlight spot morph and drift
        "highlightMorph": {
          "0%": { 
            borderRadius: "60% 40% 50% 50% / 50% 50% 40% 60%",
            transform: "translate(0, 0) scale(1)",
            opacity: "0.95"
          },
          "33%": { 
            borderRadius: "40% 60% 60% 40% / 40% 60% 50% 50%",
            transform: "translate(15%, 10%) scale(1.1)",
            opacity: "0.85"
          },
          "66%": { 
            borderRadius: "55% 45% 40% 60% / 60% 40% 55% 45%",
            transform: "translate(-10%, -5%) scale(0.9)",
            opacity: "0.9"
          },
          "100%": { 
            borderRadius: "60% 40% 50% 50% / 50% 50% 40% 60%",
            transform: "translate(0, 0) scale(1)",
            opacity: "0.95"
          },
        },
        // Accent wash morph and float
        "accentMorph": {
          "0%": { 
            borderRadius: "50% 50% 55% 45% / 45% 55% 50% 50%",
            transform: "translate(0, 0) rotate(0deg)",
            opacity: "0.75"
          },
          "33%": { 
            borderRadius: "60% 40% 45% 55% / 55% 45% 60% 40%",
            transform: "translate(-12%, 8%) rotate(-10deg)",
            opacity: "0.85"
          },
          "66%": { 
            borderRadius: "45% 55% 60% 40% / 40% 60% 45% 55%",
            transform: "translate(8%, -6%) rotate(8deg)",
            opacity: "0.7"
          },
          "100%": { 
            borderRadius: "50% 50% 55% 45% / 45% 55% 50% 50%",
            transform: "translate(0, 0) rotate(0deg)",
            opacity: "0.75"
          },
        },
        // Edge glow morph
        "edgeMorph": {
          "0%": { 
            borderRadius: "55% 45% 50% 50% / 50% 50% 45% 55%",
            transform: "rotate(0deg)"
          },
          "25%": { 
            borderRadius: "45% 55% 55% 45% / 45% 55% 50% 50%",
            transform: "rotate(90deg)"
          },
          "50%": { 
            borderRadius: "50% 50% 45% 55% / 55% 45% 55% 45%",
            transform: "rotate(180deg)"
          },
          "75%": { 
            borderRadius: "55% 45% 50% 50% / 50% 50% 45% 55%",
            transform: "rotate(270deg)"
          },
          "100%": { 
            borderRadius: "55% 45% 50% 50% / 50% 50% 45% 55%",
            transform: "rotate(360deg)"
          },
        },
        // Marquee scroll for long text
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "marquee": "marquee 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
