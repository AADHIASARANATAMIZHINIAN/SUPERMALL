/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sandal White and Black Color Palette
        primary: {
          50: '#faf8f6',
          100: '#f5f1eb',
          200: '#ede7df',
          300: '#e3dace',
          400: '#d9ccbb',
          500: '#cfbea8',
          600: '#c5b095',
          700: '#b8a089',
          800: '#a8907d',
          900: '#968071',
        },
        secondary: {
          50: '#f8f8f8',
          100: '#e8e8e8',
          200: '#d3d3d3',
          300: '#b8b8b8',
          400: '#a0a0a0',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
        },
        accent: {
          50: '#fffbf7',
          100: '#fff5ed',
          200: '#ffeee0',
          300: '#ffd9bf',
          400: '#ffb890',
          500: '#ff9966',
          600: '#ff7a3d',
          700: '#e67345',
          800: '#cc6635',
          900: '#a6551f',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Obsidian Void Theme - Dark, Professional, High Contrast
        obsidian: {
          50: '#f5f5f7',
          100: '#e1e1e6',
          200: '#c3c3cc',
          300: '#a0a0b2',
          400: '#7d7d99',
          500: '#5f5f7f',
          600: '#4a4a66',
          700: '#35354d',
          800: '#202033',
          900: '#0d0d1a',
          950: '#050508',
        },
        void: {
          DEFAULT: '#0a0a0f',
          light: '#12121a',
          dark: '#050508',
        },
        darkAccent: {
          primary: '#6366f1',     // Indigo
          secondary: '#8b5cf6',   // Purple
          success: '#10b981',     // Emerald
          warning: '#f59e0b',     // Amber
          danger: '#ef4444',      // Red
          info: '#3b82f6',        // Blue
        },
        surface: {
          DEFAULT: '#1a1a24',
          elevated: '#232330',
          hover: '#2a2a3d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'obsidian': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'obsidian-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'obsidian-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
