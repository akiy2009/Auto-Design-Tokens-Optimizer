const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser').default; 
const pkg = require('./package.json');

module.exports = [
  // ESM
  {
    input: 'src/index.ts',
    output: { file: pkg.module, format: 'es', sourcemap: true },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types'
      }),
      terser()
    ]
  },

  // CJS
  {
    input: 'src/index.ts',
    output: { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      terser()
    ]
  },

  // PostCSS plugin ESM
  {
    input: 'src/postcss-plugin.ts',
    output: { file: 'dist/esm/postcss-plugin.esm.js', format: 'es', sourcemap: true },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
      terser()
    ]
  },

  // PostCSS plugin CJS
  {
    input: 'src/postcss-plugin.ts',
    output: { file: 'dist/cjs/postcss-plugin.cjs.js', format: 'cjs', sourcemap: false, exports: 'default' },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
      terser()
    ]
  },

  // CLI build (CJS)
  {
    input: 'src/cli.ts',
    output: { file: 'dist/bin/adt-optimize.cjs', format: 'cjs', sourcemap: false },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
      terser()
    ]
  },

  // Test build
  {
    input: 'test/example.ts',
    output: [
      { file: 'dist/test/example.cjs.js', format: 'cjs', sourcemap: false },
      { file: 'dist/test/example.esm.js', format: 'es', sourcemap: false }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
      terser()
    ]
  }
];