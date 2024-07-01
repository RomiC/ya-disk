import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';
import markdown from '@eslint/markdown';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
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
  { files: ['lib/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    files: ['tests/**/*.js', 'lib/__mocks__/*.js'],
    plugins: { js, prettier, jest },
    languageOptions: {
      globals: jest.environments.globals.globals,
      sourceType: 'commonjs'
    }
  },
  {
    files: ['README.md'],
    plugins: { markdown },
    language: 'markdown/commonmark'
  }
]);
