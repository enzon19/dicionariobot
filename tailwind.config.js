module.exports = {
  content: [
    './src/front/**/*.{html,js,css}'
  ],
  theme: {
    fontFamily: {
      // Define your custom font here
      'sans': ['Montserrat', 'sans-serif'],
      'mono': ['Consolas', 'Courier New', 'monospace']
    },
    extend: {
      colors: {
        // Define your custom color palette here
        'red': '#ee2919',
        'dry-tomato': '#8e190f',
        'burnt-tomato': '#7a160d',
        'blood': '#661008',
        'hurt': '#420903',
        'pain': '#2d0804',
        'bulgarian-rose': '#500c06',
        'clear-red': '#ff3826'
      },
    },
  }
}