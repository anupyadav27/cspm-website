import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020509',
          900: '#060B18',
          800: '#0D1530',
          700: '#162040',
          600: '#1E2D50',
          500: '#2D4070',
        },
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#1e3a8a',
        },
        csm: {
          cyan:   '#22D3EE',
          green:  '#10B981',
          amber:  '#F59E0B',
          red:    '#EF4444',
          purple: '#A855F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'slide-up':   'slideUp 0.5s ease-out',
        'fade-in':    'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-brand':  '0 0 40px rgba(99,102,241,0.3), 0 0 80px rgba(99,102,241,0.12)',
        'glow-cyan':   '0 0 40px rgba(34,211,238,0.25), 0 0 80px rgba(34,211,238,0.1)',
        'glow-sm':     '0 0 16px rgba(99,102,241,0.2)',
        'card':        '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':  '0 12px 48px rgba(99,102,241,0.2), 0 4px 16px rgba(0,0,0,0.5)',
        'glass':       '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-hover': '0 16px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        'gradient-glow':     'linear-gradient(135deg, #818CF8 0%, #22D3EE 100%)',
        'gradient-dark':     'linear-gradient(135deg, #0D1530 0%, #060B18 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-border':   'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(34,211,238,0.3), transparent)',
        'noise':             'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            code: {
              backgroundColor: '#f1f5f9',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.375rem',
              fontWeight: '400',
              '&::before': { content: '""' },
              '&::after': { content: '""' },
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            pre: {
              backgroundColor: '#0f172a',
              color: '#e2e8f0',
            },
            table: {
              fontSize: '0.875rem',
            },
            'th, td': {
              padding: '0.5rem 0.75rem',
            },
            h1: { scrollMarginTop: '5rem' },
            h2: { scrollMarginTop: '5rem' },
            h3: { scrollMarginTop: '5rem' },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
