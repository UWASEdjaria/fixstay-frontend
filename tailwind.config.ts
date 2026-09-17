import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F172A",      // Midnight slate (Header, Primary text)
          surface: "#1E293B",   // Deep slate (Borders, Contrast surfaces)
          muted: "#64748B",     // Cool slate (Subtitles, Metadata)
          border: "#CBD5E1",    // Neutral border lines
          canvas: "#F8FAFC",    // Soft backdrop
          linen: "#F1F5F9",     // Warm off-white surface
        },
        accent: {
          DEFAULT: "#D97706",   // Warm Amber interactive buttons
          hover: "#B45309",     // Deep Amber hover state
          light: "#FDE68A",     // Amber highlight
          tint: "#FFFBEB",      // Amber wash background
        },
        urgency: {
          low: {
            text: "#065F46",
            bg: "#ECFDF5",
            border: "#A7F3D0",
          },
          medium: {
            text: "#92400E",
            bg: "#FFFBEB",
            border: "#FDE68A",
          },
          high: {
            text: "#9F1239",
            bg: "#FFF1F2",
            border: "#FECDD3",
          },
          critical: {
            text: "#4C0519",
            bg: "#FFE4E6",
            border: "#FDA4AF",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
