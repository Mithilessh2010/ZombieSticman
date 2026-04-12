/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f1a',
        accent: '#22c55e',
        secondary: '#38bdf8',
        danger: '#ef4444',
        xp: '#a78bfa',
        surface: 'rgba(255,255,255,0.05)',
        glass: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(34,197,94,0.4)',
        'glow-red': '0 0 20px rgba(239,68,68,0.4)',
        'glow-cyan': '0 0 20px rgba(56,189,248,0.4)',
        'glow-purple': '0 0 20px rgba(167,139,250,0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(34,197,94,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(34,197,94,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
