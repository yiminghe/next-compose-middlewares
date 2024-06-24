import { defineConfig } from 'cypress';
import codeCoverage from '@cypress/code-coverage/task';

export default defineConfig({
  projectId: '5v7p13',
  env: {
    codeCoverage: {
      url: 'http://localhost:3000/tests/coverage',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
});
