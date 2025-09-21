export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],  
        heading: ['Roboto', 'sans-serif'],        
      },
      colors: {
        "brand-black": "#070707",
        "brand-red": "#bf1f14",
        "brand-gray": "#1a1a1a",
        "brand-light": "#e0e0e0",
        "brand-muted": "#cccccc",
      },
    },
  },
  plugins: [],
};
