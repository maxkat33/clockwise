/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        gridAutoRows: {
          fr: 'minmax(0, 1fr)',
        },
      },
    },
    plugins: [],
}