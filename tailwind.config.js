module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A5C9A', // Your logo blue
          light: '#4B8DF8'    // Accent blue
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.2)',
          border: 'rgba(255, 255, 255, 0.3)'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
