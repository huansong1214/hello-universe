import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js configs.
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier to disable conflicting formatting rules.
  {
    name: 'prettier',
    rules: {
      ...prettier.rules,
    },
  },

  // Import plugin rules.
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      '@next/next/no-img-element': 'off',

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-named-as-default': 'warn',
    },
  },
];

export default eslintConfig;
