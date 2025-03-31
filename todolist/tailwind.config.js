/** @type {import('tailwindcss').Config} */
export default {
  content: [  "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'primary': 'rgba(var(--primary))',
        'bg-primary': 'rgba(var(--bg-primary))',
        'bg-secondary': 'rgba(var(--bg-secondary))',
        'txt-primary': 'rgba(var(--text-primary))'
      }
    },
  },
  plugins: [],
};
