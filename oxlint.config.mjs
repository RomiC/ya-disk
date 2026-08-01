import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: { correctness: 'error' },
  env: { builtin: true, node: true }
});
