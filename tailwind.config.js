const isProduction = !process.env.ROLLUP_WATCH; // or some other env var like NODE_ENV
module.exports = {
    theme: {
    // Some useful comment
    fontFamily: {
      'Poppins': ['Poppins', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        purple: '0 4px 14px 0 rgba(109, 40, 217, 0.30)',
      },
    },
  },
  // only needed in Tailwind 1.0 for tailwind 2.0 compat
  // future: { 
  //     purgeLayersByDefault: true, 
  //     removeDeprecatedGapUtilities: true,
  //   },
  plugins: [],
  purge: {
    content: [
      "./src/**/*.svelte",
      // may also want to include HTML files
      // "./src/**/*.html"
    ], 
    // this is for extracting Svelte `class:` syntax but is not perfect yet, see below
    defaultExtractor: content => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
      const broadMatchesWithoutTrailingSlash = broadMatches.map(match => _.trimEnd(match, '\\'))
      const matches = broadMatches
        .concat(broadMatchesWithoutTrailingSlash)
      return matches
    },
    enabled: isProduction // disable purge in dev
  },
};

