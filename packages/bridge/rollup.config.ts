import typescript from '@rollup/plugin-typescript';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const browserTarget = {
  chrome: '87',
  firefox: '78',
  safari: '14',
  edge: '88',
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
    input: 'lib/index.ts',
    output: {
      file: 'bin/index.js',
      format: 'es',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      getBabelConfig(browserTarget),
      terser(),
    ],
  },
  // 生成 ESM d.ts 声明文件
  {
    input: 'lib/index.ts',
    output: {
      format: 'es',
      file: 'typings/index.d.ts',
    },
    plugins: [dts()],
  },
];
