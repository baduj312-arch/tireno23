/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tireno: {
          dark: '#0D0D0D',
          darker: '#080808',
          surface: '#1A1A1A',
          surfaceLight: '#262626',
          orange: '#FF6B2C',
          orangeLight: '#FF8A5B',
          orangeDark: '#E55A1F',
          green: '#22C55E',
          greenDark: '#16A34A',
          yellow: '#EAB308',
          red: '#EF4444',
          blue: '#3B82F6',
          blueLight: '#60A5FA',
          gray: '#6B7280',
          grayLight: '#9CA3AF',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'dot-pulse': 'dotPulse 1.5s ease-in-out infinite',
        'route-dash': 'routeDash 2s linear infinite',
        'countdown': 'countdown 1s linear',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        dotPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
        routeDash: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
