import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'server/node_modules/**', '.agents/**', '.claude/**', '.opencode/**', '.codex/**', 'cloudflare/**'],
  },

  // Frontend
  {
    files: ['src/**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.serviceworker },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Sin esto, todo componente usado solo en JSX se marca como no usado.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },

  // Backend y scripts
  {
    files: ['server/**/*.js', 'api/**/*.js', 'scripts/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_|^next$' }],
      // El pipeline de correos debe registrar por logger.js, no por consola.
      'no-restricted-syntax': ['warn', {
        selector: "CallExpression[callee.object.name='console'][callee.property.name='log']",
        message: 'Usa logDebug o logInfo de server/logger.js: console.log deja datos del usuario en los logs de produccion.',
      }],
    },
  },
];
