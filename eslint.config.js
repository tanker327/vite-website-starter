import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importsPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore build output directory
  { ignores: ['dist'] },
  {
    // Base configurations
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    // Apply rules to TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: importsPlugin,
    },
    rules: {
      // Enforce consistent type imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      // Configure import order and grouping
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Configure import member sorting
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],


      // Code style rules
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'import/newline-after-import': ['error', { count: 1 }],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: 'function',
        },
        { blankLine: 'always', prev: 'function', next: 'function' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
      'no-multi-spaces': 'error',

      // Max line length
      'max-len': [
        'error',
        {
          code: 80, // or 100, 120 etc
          tabWidth: 2,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
    },
  }
);
