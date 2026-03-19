/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"IBM Plex Sans"', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        // Light app
        bg:      '#f7f8ff',
        bg2:     '#ffffff',
        bg3:     '#f0f3ff',
        bg4:     '#e6ebff',
        // Primary blue
        primary: '#3b82f6',
        // Secondary purple
        purple:  '#7c3aed',
        // Deep navy (landing/admin sidebar)
        navy:    '#0b0f2e',
        // Text
        text1:   '#0f172a',
        text2:   '#475569',
        text3:   '#94a3b8',
        // Semantic
        amber:   '#f59e0b',
        red:     '#ef4444',
      },
    },
  },
  plugins: [],
}
