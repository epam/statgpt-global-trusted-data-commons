/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../libs/**/src/**/*!(*.stories|*.spec).{ts,tsx,html}',
    './node_modules/@epam/statgpt-*/**/*.{js,ts,jsx,tsx,mjs}',
  ],
  theme: {
    extend: {
      screens: {
        '2xl': { max: '1919px' },
        xl: { max: '1536px' },
        lg: { max: '1279px' },
        'lg-min': { min: '1280px' },
        md: { max: '1023px' },
        'md-min': { min: '1024px' },
        'sm-explorer': { max: '998px' },
        sm: { max: '719px' },
        'sm-min': { min: '720px' },
        xs: { max: '428px' },
        'xs-min': { min: '429px' },
      },
      colors: {
        primary: '#414fff',
        white: '#ffffff',
        blackout: '#090d13b3',
        neutrals: {
          1000: '#2b2b2d',
          900: '#3f404a',
          800: '#757575',
          700: '#89898b',
          600: '#cfcfcf',
          500: '#dddfe8',
          400: '#e9eef6',
          300: '#f0f4f8',
          200: '#f3f5ff',
          100: '#f3f6fb',
        },
        hues: {
          900: '#0d2282',
          800: '#354487',
          600: '#9da4ff',
          400: '#b1b7ff',
          200: '#cbd0ff',
          100: '#dfe6ff',
        },
        accent: {
          700: '#0094ff',
          300: '#90a1ff',
        },
        semantic: {
          error: '#d6323e',
          warning: '#d4c000',
          success: '#00cc6f',
        },
        gradients: {
          light: '#73e1e5',
          middle: '#414fff',
          dark: '#6843e9',
          white10: '#ffffff1a',
          neutrals300: '#f0f4f81a',
        },
        highlight: '#bedaff',
      },
      zIndex: {
        tooltip: '100000',
        modal: '100001',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
