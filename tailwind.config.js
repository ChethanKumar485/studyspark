/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0B0E1A",
        surface: "#151933",
        surface2: "#1E2444",
        line: "#2C3358",
        gold: "#F2B134",
        teal: "#4ECDC4",
        coral: "#FF6B5B",
        text: "#F5F6FB",
        dim: "#8890B5",
        paper: "#F6F5F1",
        lsurface: "#FFFFFF",
        lline: "#E6E3DA",
        ltext: "#1B1B22",
        ldim: "#6B6B78",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl2: "20px",
      },
    },
  },
  plugins: [],
};
