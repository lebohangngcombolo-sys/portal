/**
 * Babel preset for tb-state.
 *
 * Targets browsers that support modern JS (2020+) — no polyfills needed
 * for XMLHttpRequest, Cache API, or Storage APIs.
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'not dead', 'not ie 11'],
          node: '18',
        },
        modules: false,
      },
    ],
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
};