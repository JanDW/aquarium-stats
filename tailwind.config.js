/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.njk', './src/**/*.md', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Update this line with your desired font stack
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};  