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
        "glow-pulse": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.08)" },
        },
        "auraPulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        "blobMorph1": {
          "0%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "20%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "40%": { borderRadius: "55% 45% 35% 65% / 35% 55% 65% 45%" },
          "60%": { borderRadius: "40% 60% 55% 45% / 65% 35% 45% 55%" },
          "80%": { borderRadius: "70% 30% 45% 55% / 45% 65% 55% 35%" },
          "100%": { borderRadius: "35% 65% 60% 40% / 55% 45% 40% 60%" },
        },
        "blobMorph2": {
          "0%": { borderRadius: "40% 60% 65% 35% / 70% 30% 65% 35%" },
          "25%": { borderRadius: "65% 35% 40% 60% / 35% 65% 40% 60%" },
          "50%": { borderRadius: "50% 50% 55% 45% / 55% 45% 50% 50%" },
          "75%": { borderRadius: "35% 65% 35% 65% / 45% 55% 65% 35%" },
          "100%": { borderRadius: "55% 45% 60% 40% / 60% 40% 35% 65%" },
        },
        "blobMorph3": {
          "0%": { 
            borderRadius: "50% 50% 40% 60% / 40% 60% 45% 55%",
            transform: "translate(0, 0) rotate(0deg)"
          },
          "33%": { 
            borderRadius: "60% 40% 55% 45% / 55% 45% 60% 40%",
            transform: "translate(8%, -6%) rotate(5deg)"
          },
          "66%": { 
            borderRadius: "45% 55% 45% 55% / 45% 55% 40% 60%",
            transform: "translate(-5%, 8%) rotate(-3deg)"
          },
          "100%": { 
            borderRadius: "55% 45% 60% 40% / 60% 40% 55% 45%",
            transform: "translate(3%, -3%) rotate(2deg)"
          },
        },
        "highlightDrift": {
          "0%": { 
            transform: "translate(0, 0) scale(1)",
            opacity: "0.95"
          },
          "50%": { 
            transform: "translate(12%, 8%) scale(1.1)",
            opacity: "0.8"
          },
          "100%": { 
            transform: "translate(-8%, -5%) scale(0.95)",
            opacity: "0.9"
          },
        },
        "accentFloat": {
          "0%": { 
            transform: "translate(0, 0) rotate(0deg)",
            opacity: "0.7"
          },
          "50%": { 
            transform: "translate(-15%, 10%) rotate(-8deg)",
            opacity: "0.85"
          },
          "100%": { 
            transform: "translate(10%, -8%) rotate(5deg)",
            opacity: "0.75"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "glow-pulse": "glow-pulse 7s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
