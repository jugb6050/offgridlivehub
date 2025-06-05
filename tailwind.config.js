// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        "-10": "-10",
      },
      fontFamily: {
        cyberpunk: ["Orbitron", "sans-serif"],
      },
      animation: {
        "background-glow": "glow 8s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
