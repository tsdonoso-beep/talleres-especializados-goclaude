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
        brand: ["Manrope", "sans-serif"],
        mono: ["DM Mono", "monospace"],
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
        "grama-green": {
          DEFAULT: "hsl(var(--grama-green))",
          foreground: "hsl(var(--grama-green-foreground))",
        },
        /* Dark surface tokens */
        "dk-base": "hsl(var(--dk-base))",
        "dk-surface": "hsl(var(--dk-surface))",
        "dk-card": "hsl(var(--dk-card))",
        "dk-border": "hsl(var(--dk-border))",
        "dk-text": "hsl(var(--dk-text))",
        "dk-muted": "hsl(var(--dk-muted))",
        /* Green tokens */
        "g": "hsl(var(--g))",
        "g-dark": "hsl(var(--g-dark))",
        "g-deep": "hsl(var(--g-deep))",
        "g-light": "hsl(var(--g-light))",
        "g-pale": "hsl(var(--g-pale))",
        "g-mint": "hsl(var(--g-mint))",
        /* Accent / Acompañamiento */
        "acc-lila": "hsl(var(--acc-lila))",
        "acc-lila-light": "hsl(var(--acc-lila-light))",
        "acc-yellow": "hsl(var(--acc-yellow))",
        "acc-yellow-light": "hsl(var(--acc-yellow-light))",
        /* Tag tokens */
        "tag-pdf-bg": "hsl(var(--tag-pdf-bg))",
        "tag-pdf-text": "hsl(var(--tag-pdf-text))",
        "tag-vid-bg": "hsl(var(--tag-vid-bg))",
        "tag-vid-text": "hsl(var(--tag-vid-text))",
        "tag-3d-bg": "hsl(var(--tag-3d-bg))",
        "tag-3d-text": "hsl(var(--tag-3d-text))",
        /* Taller accents */
        "t1": "var(--t1)",
        "t2": "var(--t2)",
        "t3": "var(--t3)",
        "t4": "var(--t4)",
        "t5": "var(--t5)",
        "t6": "var(--t6)",
        "t7": "var(--t7)",
        "t8": "var(--t8)",
        "t9": "var(--t9)",
        /* Semantic status */
        "success-bg": "var(--success-bg)",
        "success-text": "var(--success-text)",
        "warning-bg": "var(--warning-bg)",
        "warning-text": "var(--warning-text)",
        "danger-bg": "var(--danger-bg)",
        "danger-text": "var(--danger-text)",
        "info-bg": "var(--info-bg)",
        "info-text": "var(--info-text)",
        "live-dot": "var(--live-dot)",
        "next-dot": "var(--next-dot)",
        "done-dot": "var(--done-dot)",
        "async-dot": "var(--async-dot)",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "ds-sm": "var(--radius-sm)",
        "ds-md": "var(--radius-md)",
        "ds-lg": "var(--radius-lg)",
        "ds-xl": "var(--radius-xl)",
        "ds-pill": "var(--radius-pill)",
      },
      boxShadow: {
        "card": "var(--shadow-card)",
        "card-hover": "var(--shadow-hover)",
        "cta": "var(--shadow-cta)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
