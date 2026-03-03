const config = {
  /* 1️⃣ Tell PostCSS to parse SCSS syntax */
  parser: 'postcss-scss',

  plugins: [
    /* 2️⃣ Tailwind + autoprefixer */
    '@tailwindcss/postcss',
    'autoprefixer',
  ],
};

export default config;
