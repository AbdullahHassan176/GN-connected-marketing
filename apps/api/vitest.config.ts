import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@repo/lib': path.resolve(__dirname, '../../packages/lib/src'),
    },
  },
});
