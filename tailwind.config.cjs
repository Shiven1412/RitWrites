// tailwind.config.cjs
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,css}', // <-- include css files here
  ],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
