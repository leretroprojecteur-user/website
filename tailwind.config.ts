import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // extend: {
    //   colors: {
    //     ["retro-gray"]: "#6A6A6D",
    //     ["retro-black"]: "#030303",
    //     ["retro-green"]: "#E2FF46",
    //   },
    //   fontFamily: {
    //     degular: ["var(--font-degular)"],
    //     suisse: ["var(--font-suisse)"],
    //   },
    // },
  },
  plugins: [],
};
export default config;
