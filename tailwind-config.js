/* =========================================================
   tailwind-config.js
   Konfigurasi warna & font kustom untuk Tailwind CDN.
   File ini WAJIB dimuat setelah script Tailwind CDN,
   dan sebelum Tailwind memindai class di halaman.
========================================================= */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy:     '#101B2D',
        navydeep: '#0A1220',
        paper:    '#FFFFFF',
        mist:     '#F1F3F6',
        line:     '#DDE1E7',
        ink:      '#1B2430',
        slate:    '#5B6472',
        signal:   '#1E2C41',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans:  ['Inter', 'sans-serif'],
      },
    }
  }
};
