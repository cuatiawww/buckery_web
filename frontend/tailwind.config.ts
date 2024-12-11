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
        primary: "#FFCA0E",    // Kuning
        secondary: "#85ECA9",  // Hijau mint
        tertiary: "#98CAD5",   // Biru muda
        primary_bg: "#F8E6C2", //Krem
      },
      fontFamily: {
        beachday: ["var(--font-beachday)"],
        ChickenSoup: ["var(--font-ChickenSoup)"],
        form: ["Arial", "Helvetica", "system-ui", "sans-serif"], // New font family for forms
      },
    },
  },
  plugins: [],
};

export default config;