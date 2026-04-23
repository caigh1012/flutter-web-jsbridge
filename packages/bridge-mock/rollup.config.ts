import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const nodeTarget = {
  node: 14,
};

/**
 * babel config
 */
function getBabelConfig(target) {
  return getBabelOutputPlugin({
    presets: [
      [
        '@babel/preset-env',
        {
          targets: target,
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
    ],
    plugins: ['@babel/plugin-transform-runtime'],
  });
}

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'bin/index.mjs',
      format: 'es',
      banner: '#!/usr/bin/env node',
    },
    plugins: [typescript(), getBabelConfig(nodeTarget), terser()],
  },
];
