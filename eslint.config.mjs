import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules',
      '**/.next',
      '**/next-env.d.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/jest.config.ts',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
      prettier: prettierPlugin,
      tailwindcss: tailwindPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...tailwindPlugin.configs.recommended.rules,

      '@next/next/no-html-link-for-pages': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',

      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-empty': 'error',
      'no-constant-condition': 'error',
      'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0 }],

      // Guardrails for sonatype-2017-0717 (react-dom XSS via prop spreading):
      // forbid raw HTML injection and flag prop spreading for review.
      'react/no-danger': 'error',
      'react/jsx-props-no-spreading': 'warn',
      'react-hooks/exhaustive-deps': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^__',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      'prettier/prettier': 'error',
    },
  },
];
