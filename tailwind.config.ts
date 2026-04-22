/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow":   "spin 8s linear infinite",
        "fade-in":     "fadeIn 0.4s ease forwards",
        "slide-up":    "slideUp 0.4s ease forwards",
        "slide-down":  "slideDown 0.2s ease forwards",
        "scale-in":    "scaleIn 0.18s ease forwards",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },                              to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-8px)"  }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn:   { from: { opacity: "0", transform: "scale(0.95)" },      to: { opacity: "1", transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
};
