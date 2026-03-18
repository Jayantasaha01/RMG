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
        bg:      '#0a0e0a',
        bg2:     '#111811',
        bg3:     '#161f16',
        bg4:     '#1e281e',
        green:   '#4ade80',
        amber:   '#fbbf24',
        red:     '#f87171',
        blue:    '#60a5fa',
        text1:   '#e8f0e8',
        text2:   '#9aad9a',
        text3:   '#5c6e5c',
      },
      borderColor: {
        DEFAULT: 'rgba(74,122,74,0.18)',
        strong:  'rgba(74,122,74,0.32)',
      },
    },
  },
  plugins: [],
}
