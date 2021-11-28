module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        '2.5xl': '1.7rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.12)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
        modal:
          '0 0 45px -5px rgba(0, 0, 0, 0.6), 0 0 20px -5px rgba(0, 0, 0, 0.3)',
        nr: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      },
      gridTemplateColumns: {
        nr1: 'repeat(1, minmax(min-content, max-content))',
        nr2: 'repeat(2, minmax(min-content, max-content))',
        nr3: 'repeat(3, minmax(min-content, max-content))',
        nr4: 'repeat(4, minmax(min-content, max-content))',
        nr5: 'repeat(5, minmax(min-content, max-content))',
        nr6: 'repeat(6, minmax(min-content, max-content))',
        nr7: 'repeat(7, minmax(min-content, max-content))',
        nr8: 'repeat(8, minmax(min-content, max-content))',
        nr9: 'repeat(9, minmax(min-content, max-content))',
        nr10: 'repeat(10, minmax(min-content, max-content))',
        nr11: 'repeat(11, minmax(min-content, max-content))',
        nr12: 'repeat(12, minmax(min-content, max-content))',
        nr13: 'repeat(13, minmax(min-content, max-content))',
        nr14: 'repeat(14, minmax(min-content, max-content))',
        nr15: 'repeat(15, minmax(min-content, max-content))',
        nr16: 'repeat(16, minmax(min-content, max-content))',
        nr17: 'repeat(17, minmax(min-content, max-content))',
        nr18: 'repeat(18, minmax(min-content, max-content))',
        nr19: 'repeat(19, minmax(min-content, max-content))',
        nr20: 'repeat(20, minmax(min-content, max-content))',
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(123, 3, 89, 0.25)',
      },
      scale: {
        0: '0',
        25: '.25',
        50: '.5',
        75: '.75',
        90: '.9',
        95: '.95',
        100: '1',
        105: '1.05',
        102: '1.02',
        103: '1.03',
        104: '1.04',
        110: '1.1',
        125: '1.25',
        150: '1.5',
        200: '2',
      },
      width: {
        '9/10': '90%',
        'nr-full': '97.9%',
      },
      height: {
        '9/10': '90%',
        'nr-full': '91%',
      },
      textColor: {
        'green-nr': '#39ff14',
      },
      backgroundColor: {
        'nr-900': '#191919',
        'nr-800': '#262626',
        'nr-700': '#393939',
        'nr-600': '#525252',
        'nr-500': '#656565',
        'nr-active': '#39ff14',
        'nr-green': '#39ff14',
      },
      borderColor: {
        'green-nr': '#39ff14',
      },
      ringColor: {
        'green-nr': '#39ff14',
      },
      fontFamily: {
        logo: 'LibertyIsland',
      },
    },
  },
  variants: {
    extend: {
      accessibility: ['responsive', 'focus-within', 'focus'],
      backgroundColor: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
        'active',
      ],
      backgroundOpacity: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      borderColor: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      borderOpacity: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      boxShadow: [
        'responsive',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
        'active',
      ],
      dropShadow: ['responsive', 'active'],
      gradientColorStops: ['responsive', 'dark', 'hover', 'focus'],
      opacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
      outline: ['responsive', 'focus-within', 'focus'],
      padding: ['responsive', 'hover'],
      placeContent: ['responsive'],
      placeItems: ['responsive'],
      placeSelf: ['responsive'],
      placeholderColor: ['responsive', 'dark', 'focus'],
      placeholderOpacity: ['responsive', 'dark', 'focus'],
      ringColor: ['responsive', 'dark', 'focus-within', 'focus', 'active'],
      ringOffsetColor: [
        'responsive',
        'dark',
        'focus-within',
        'focus',
        'active',
      ],
      ringOffsetWidth: ['responsive', 'focus-within', 'focus', 'active'],
      ringOpacity: ['responsive', 'dark', 'focus-within', 'focus', 'active'],
      ringWidth: ['responsive', 'focus-within', 'focus', 'active'],
      rotate: ['responsive', 'hover', 'focus'],
      scale: ['responsive', 'hover', 'focus', 'active'],
      textColor: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      textDecoration: [
        'responsive',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      textOpacity: [
        'responsive',
        'dark',
        'group-hover',
        'focus-within',
        'hover',
        'focus',
      ],
      translate: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [],
};
