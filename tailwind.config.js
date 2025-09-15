/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores de la bandera de Santa Cruz de la Sierra
        "santa-cruz": {
          green: "#00A651", // Verde principal
          white: "#FFFFFF", // Blanco
          red: "#E31E24", // Rojo
          blue: "#003DA5", // Azul
          yellow: "#FFD700", // Dorado
        },
        // Nueva paleta para 'Cuentos de Guarayo Voces Ancestrales'
        guarayo: {
          earth: "#6B4F3A", // Tierra / madera
          forest: "#1B5E20", // Verde profundo
          light: "#F5F1E6", // Fondo claro cálido
          accent: "#C47F1D", // Dorado / artesanal
          river: "#0E4D64", // Azul profundo (agua)
        },
        primaryGuarayo: {
          50: "#f2f9f3",
          100: "#e0f1e3",
          200: "#b9e1c1",
          300: "#84c996",
          400: "#4ba667",
          500: "#1B5E20", // forest
          600: "#174f1b",
          700: "#123d15",
          800: "#0e2d10",
          900: "#0a200b",
        },
        secondaryGuarayo: {
          50: "#fcf7ef",
          100: "#f7e9d2",
          200: "#ebce9f",
          300: "#dfb26b",
          400: "#d49944",
          500: "#C47F1D", // accent
          600: "#a86718",
          700: "#864f13",
          800: "#663a0f",
          900: "#4d2a0b",
        },
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#00A651", // Verde Santa Cruz
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        secondary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#E31E24", // Rojo Santa Cruz
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
