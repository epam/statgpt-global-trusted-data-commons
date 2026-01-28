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
        primary: 'var(--primary)',
        white: 'var(--white)',
        blackout: 'var(--blackout)',
        highlight: 'var(--highlight)',
        neutrals: {
          1000: 'var(--neutrals-1000)',
          900: 'var(--neutrals-900)',
          800: 'var(--neutrals-800)',
          700: 'var(--neutrals-700)',
          600: 'var(--neutrals-600)',
          500: 'var(--neutrals-500)',
          400: 'var(--neutrals-400)',
          300: 'var(--neutrals-300)',
          200: 'var(--neutrals-200)',
          100: 'var(--neutrals-100)',
        },
        hues: {
          900: 'var(--hues-900)',
          800: 'var(--hues-800)',
          600: 'var(--hues-600)',
          400: 'var(--hues-400)',
          200: 'var(--hues-200)',
          100: 'var(--hues-100)',
        },
        accent: {
          700: 'var(--accent-700)',
          300: 'var(--accent-300)',
        },
        semantic: {
          error: 'var(--semantic-error)',
          warning: 'var(--semantic-warning)',
          success: 'var(--semantic-success)',
        },
        gradients: {
          light: 'var(--gradients-light)',
          middle: 'var(--gradients-middle)',
          dark: 'var(--gradients-dark)',
          white10: 'var(--white10)',
          neutrals300: 'var(--neutrals-300-10)',
        },
      },
      zIndex: {
        tooltip: '100000',
        modal: '100001',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
