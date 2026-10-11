/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight Variable"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#f4f2ee',
        card: '#ffffff',
        ink: { DEFAULT: '#0d0d0d', 950: '#050912', 900: '#080e1b', 800: '#0c1424', 700: '#131d33' },
        ink2: '#3a3a3a',
        mute: '#77756f',
        faint: '#a9a6a0',
        soft: '#e9e6e0',
        cyan: { glow: '#22d3ee' },
        heart: '#fb7185',
        ai: '#a78bfa',
      },
      keyframes: {
        ring: { '0%': { transform: 'scale(0.6)', opacity: '0.7' }, '100%': { transform: 'scale(2.4)', opacity: '0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        spin360: { to: { transform: 'rotate(360deg)' } },
        draw: { '0%': { strokeDashoffset: '2600' }, '100%': { strokeDashoffset: '0' } },
        hop: { '0%,100%': { transform: 'translateY(0)' }, '40%': { transform: 'translateY(-0.18em)' } },
      },
      animation: {
        ring: 'ring 2.4s cubic-bezier(0.2,0.6,0.3,1) infinite',
        float: 'float 8s ease-in-out infinite',
        blink: 'blink 1s steps(1) infinite',
        spin360: 'spin360 18s linear infinite',
        draw: 'draw 7s linear infinite',
      },
    },
  },
  plugins: [],
}
