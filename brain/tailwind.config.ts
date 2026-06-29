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
        ink: "#15181d",
        paper: "#f6f7f9",
        line: "#d9dee7",
        mint: "#0f9f8f",
        coral: "#e85d3f",
        amber: "#d99014"
      },
      boxShadow: {
        lift: "0 10px 28px rgba(21, 24, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
