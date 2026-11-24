import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

/**
 * Rollup configuration for tb-state.
 *
 * Bundles src/index.js into lib/index.js as CommonJS so that the UI can
 * require() it through the workspace link. The output is a single file —
 * there are no runtime dependencies.
 */
export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
  },
  plugins: [
    nodeResolve({ preferBuiltins: false, browser: true }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js'],
    }),
  ],
  external: [],
};