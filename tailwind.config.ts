import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ABC Monument Grotesk", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        eclipse: {
          primary: "#ff4301",
          secondary: "#c4ffc3",
          accent: "#ffb036",
          neutral: "#000",
          "neutral-content": "#fff",
          "base-100": "#ffffff",
          info: "#0000ff",
          success: "#c4ffc3",
          warning: "#e9ff53",
          error: "#e03a00",
          "primary-content": "#fff",
        },
      },
    ],
  },
};
export default config;
