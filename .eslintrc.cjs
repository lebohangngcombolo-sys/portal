/* eslint-env node */
/**
 * Root ESLint configuration.
 *
 * - Base rules for every workspace.
 * - Import layer rules are defined per workspace (ui/.eslintrc.cjs extends
 *   this and adds the layering rules).
 * - No `eslint:recommended` extensions here — workspaces opt in explicitly.
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
      },
    },
  },
  plugins: ['import'],
  rules: {
    // ---- Correctness
    'no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
    ],
    'no-undef': 'error',
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'no-shadow': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'multi-line'],

    // ---- Imports
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],
    'import/no-duplicates': 'warn',
    'import/no-cycle': ['error', { maxDepth: 5, ignoreExternal: true }],

    // ---- Style (aligned with .prettierrc)
    quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    semi: ['warn', 'always'],

    // ---- React-agnostic; React-specific rules live in ui/.eslintrc.cjs
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    'build/',
    'lib/',
    '*.config.js',
    '*.config.cjs',
    'webpack.config.js',
    'rollup.config.js',
  ],
};