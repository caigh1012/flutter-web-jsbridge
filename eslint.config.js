import pluginPrettier from 'eslint-plugin-prettier';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
// import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules'], // 忽略目录
  },
  // js文件的 eslint 配置
  {
    files: ['**/*.js'],
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'error',
    },
  },
  // demo 目录的 eslint 配置
  {
    files: ['demo/**/*.{ts,tsx}'],
    ignores: ['dist'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier: pluginPrettier,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'error',
      'no-console': 'error',
    },
  },
  {
    files: ['packages/bridge-dev-tool/*.ts'],
    ignores: ['dist'],
  },
  // {
  //   files: ['packages/bridge-mock/**/*.ts', 'packages/bridge/**/*.ts'],
  //   ignores: ['packages/bridge-mock/bin/*.js', 'packages/bridge-mock/bin/*.js'],
  //   extends: [...tseslint.configs.recommended],
  //   plugins: {
  //     prettier: pluginPrettier,
  //   },
  //   rules: {
  //     ...js.configs.recommended.rules,
  //     'prettier/prettier': 'error',
  //   },
  // },
]);
