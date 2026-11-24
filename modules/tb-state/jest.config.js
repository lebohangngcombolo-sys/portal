/**
 * Jest configuration for tb-state.
 *
 * Uses jsdom so that XMLHttpRequest, Cache API, and Storage APIs are
 * available in tests. Individual tests can still stub these globals.
 */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  clearMocks: true,
  restoreMocks: true,
};