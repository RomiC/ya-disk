export default {
  arrowParens: 'always',
  bracketSpacing: true,
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  sortPackageJson: false,
  ignorePatterns: ['dist'],
  overrides: [{ files: ['**/*.{yml,yaml}'], options: { singleQuote: false } }]
};
