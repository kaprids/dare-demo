/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tencent: {
          dark: '#0a0a0f',
          card: '#12121a',
          accent: '#00d4aa',
          blue: '#0066ff',
          warm: '#ff6b35',
          purple: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
