import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF1F1",
        lakayRed: "#EF1825",
        lakayYellow: "#FFE100",
        lakayTeal: "#35C5BB",
        lakayGreen: "#7ED957",
        ink: "#000000"
      },
      boxShadow: {
        poster: "8px 8px 0 #000000",
        button: "5px 5px 0 #000000"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Rounded MT Bold", "Arial", "sans-serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
