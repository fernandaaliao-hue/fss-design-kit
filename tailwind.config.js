/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'fss-red': '#E11A38',
        'shell': '#101011',
        'shell-surface': '#1F1F1F',
        'shell-border': '#2E2E2E',
        'shell-text': '#BCBCBC',
        'page': '#F0F0F0',
        'surface': '#FFFFFF',
        'line': '#D4D4D4',
        'ink': '#3B3B3B',
        'ink-muted': '#5B5B5B',
        'ink-dim': '#716E74',
        'fss-success': '#1E9E5A',
        'fss-warning': '#E5A100',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'fss': '8px',
        'fss-card': '20px',
      },
    },
  },
  plugins: [],
}
