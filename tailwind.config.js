/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": "#2b3d5b",
        "secondary": "#da6234"
      }
    },
  },
  plugins: [],
};
