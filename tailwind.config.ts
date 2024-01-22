import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: ({ theme }) => ({
        DEFAULT: theme("colors.retro-gray"),
      }),
      borderWidth: {
        DEFAULT: "1.5px",
      },
      colors: {
        ["retro-gray"]: "#6A6A6D",
        ["retro-gray-transparent"]: "#6A6A6D99",
        ["retro-black"]: "#030303",
        ["retro-green"]: "#E2FF46",
        ["retro-pale-green"]: "#E2FF4666",
        ["retro-blue"]: "#CCDAFF",
      },
      flexBasis: {
        "278px": `${278 / 16}rem`,
      },
      fontFamily: {
        degular: ["var(--font-degular)"],
        suisse: ["var(--font-suisse)"],
      },
      fontSize: {
        "95px": `${95 / 16}rem`,
        "71px": `${71 / 16}rem`,
        "51px": `${51 / 16}rem`,
        "44px": `${44 / 16}rem`,
        "35px": `${35 / 16}rem`,
        "32px": `${32 / 16}rem`,
        "29px": `${29 / 16}rem`,
        "25px": `${25 / 16}rem`,
        "22px": `${22 / 16}rem`,
        "21px": `${21 / 16}rem`,
        "20px": `${20 / 16}rem`,
        "19px": `${19 / 16}rem`,
        "18px": `${18 / 16}rem`,
        "16px": `${16 / 16}rem`,
        "15px": `${15 / 16}rem`,
        "14px": `${14 / 16}rem`,
      },
      gap: {
        "190px": `${190 / 16}rem`,
        "25px": `${25 / 16}rem`,
        "20px": `${20 / 16}rem`,
        "17px": `${17 / 16}rem`,
        "16px": `${16 / 16}rem`,
        "15px": `${15 / 16}rem`,
        "12px": `${12 / 16}rem`,
        "10px": `${10 / 16}rem`,
        "8px": `${8 / 16}rem`,
        "5px": `${5 / 16}rem`,
      },
      height: {
        "640px": `${640 / 16}rem`,
        "300px": `${300 / 16}rem`,
        "172px": `${172 / 16}rem`,
        "163px": `${163 / 16}rem`,
        "146px": `${146 / 16}rem`,
        "75px": `${75 / 16}rem`,
        "44px": `${44 / 16}rem`,
        "37px": `${37 / 16}rem`,
        "29px": `${29 / 16}rem`,
        "25px": `${25 / 16}rem`,
        "22px": `${22 / 16}rem`,
        "21px": `${21 / 16}rem`,
        "20px": `${20 / 16}rem`,
        "19px": `${19 / 16}rem`,
        "18px": `${18 / 16}rem`,
        "14px": `${14 / 16}rem`,
        "10px": `${10 / 16}rem`,
      },
      lineHeight: {
        "60px": `${60 / 16}rem`,
        "58px": `${58 / 16}rem`,
        "54px": `${54 / 16}rem`,
        "44px": `${44 / 16}rem`,
        "31px": `${31 / 16}rem`,
        "29px": `${29 / 16}rem`,
        "26px": `${26 / 16}rem`,
        "25px": `${25 / 16}rem`,
        "24px": `${24 / 16}rem`,
        "22px": `${22 / 16}rem`,
        "21px": `${21 / 16}rem`,
        "20px": `${20 / 16}rem`,
        "18px": `${18 / 16}rem`,
        "17px": `${17 / 16}rem`,
        "16px": `${16 / 16}rem`,
        "14px": `${14 / 16}rem`,
      },
      margin: {
        "15px": `${15 / 16}rem`,
        "-3px": `${-3 / 16}rem`,
      },
      minWidth: {
        "340px": `${340 / 16}rem`,
        "300px": `${300 / 16}rem`,
        "172px": `${172 / 16}rem`,
      },
      padding: {
        "640px": `${640 / 16}rem`,
        "100px": `${100 / 16}rem`,
        "44px": `${44 / 16}rem`,
        "32px": `${32 / 16}rem`,
        "28px": `${28 / 16}rem`,
        "27px": `${27 / 16}rem`,
        "25px": `${25 / 16}rem`,
        "23px": `${23 / 16}rem`,
        "20px": `${20 / 16}rem`,
        "19px": `${19 / 16}rem`,
        "18px": `${18 / 16}rem`,
        "17px": `${17 / 16}rem`,
        "16px": `${16 / 16}rem`,
        "15px": `${15 / 16}rem`,
        "14px": `${14 / 16}rem`,
        "13px": `${13 / 16}rem`,
        "12px": `${12 / 16}rem`,
        "11px": `${11 / 16}rem`,
        "10px": `${10 / 16}rem`,
        "9px": `${9 / 16}rem`,
        "8px": `${8 / 16}rem`,
        "6px": `${6 / 16}rem`,
        "5px": `${5 / 16}rem`,
        "4px": `${4 / 16}rem`,
        "3px": `${3 / 16}rem`,
        "2px": `${2 / 16}rem`,
        "1px": `${1 / 16}rem`,
      },
      width: {
        "278px": `${278 / 16}rem`,
        "250px": `${250 / 16}rem`,
        "207px": `${207 / 16}rem`,
        "200px": `${200 / 16}rem`,
        "95px": `${95 / 16}rem`,
        "85px": `${85 / 16}rem`,
        "75px": `${75 / 16}rem`,
        "37px": `${37 / 16}rem`,
        "35px": `${35 / 16}rem`,
        "34px": `${34 / 16}rem`,
        "29px": `${29 / 16}rem`,
        "28px": `${28 / 16}rem`,
        "25px": `${25 / 16}rem`,
        "22px": `${22 / 16}rem`,
        "19px": `${19 / 16}rem`,
        "14px": `${14 / 16}rem`,
        "13px": `${13 / 16}rem`,
        "10px": `${10 / 16}rem`,
      },
    },
  },
  plugins: [forms],
};
export default config;
