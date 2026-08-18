/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        'ink-faint': 'var(--ink-faint)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        line: 'var(--line)',
        dark: 'var(--dark)',
        'dark-alt': 'var(--dark-alt)',
        primary: 'var(--primary)',
        'primary-ink': 'var(--primary-ink)',
      },
      fontFamily: {
        display: ['Poppins', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        sans: ['"Nunito Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        shell: '1160px',
      },
    },
  },
  plugins: [],
}
