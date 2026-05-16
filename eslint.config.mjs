import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import markdown from '@eslint/markdown';

export default defineConfig([
  {
    ignores: ['dist/**', '.tmp-*/**']
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node, sourceType: 'module' },
    rules: {
      'arrow-parens': ['warn', 'always'],
      'comma-spacing': ['warn'],
      'eol-last': ['warn', 'always'],

      indent: [
        'warn',
        2,
        {
          SwitchCase: 1
        }
      ],

      'key-spacing': [
        'warn',
        {
          beforeColon: false,
          afterColon: true
        }
      ],

      'keyword-spacing': [
        'warn',
        {
          after: true
        }
      ],

      'no-extra-boolean-cast': 'off',

      'no-multiple-empty-lines': [
        'warn',
        {
          max: 1
        }
      ],

      'no-multi-spaces': 'warn',
      'no-spaced-func': 'warn',
      'no-unused-vars': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'prettier/prettier': 'warn',
      semi: ['warn', 'always'],
      'space-before-blocks': ['warn', 'always'],

      'space-before-function-paren': [
        'warn',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],

      'spaced-comment': ['warn', 'always'],
      'space-infix-ops': 'warn',
      'space-in-parens': ['warn', 'never'],

      'space-unary-ops': [
        'warn',
        {
          words: true,
          nonwords: false
        }
      ]
    }
  },
  {
    files: ['tests/**/*.js'],
    plugins: { js, prettier },
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: 'module'
    }
  },
  {
    files: ['README.md'],
    plugins: { markdown },
    language: 'markdown/commonmark'
  }
]);
