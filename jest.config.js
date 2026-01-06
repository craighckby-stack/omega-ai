import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const customJestConfig: Config = {
  // Use jsdom environment for browser-like testing
  testEnvironment: 'jest-environment-jsdom',
  
  // Setup files for @testing-library/jest-dom extensions
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Ignore patterns established by Next.js defaults and build artifacts
  transformIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    // Ensure all test files are ignored from transformation if placed inside source directories
    'src/**/__tests__/**/*',
  ],
  
  // Define coverage collection paths and ignores
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**/*',
  ],
  
  // DALEK KHAN MANDATE: Enforce strict coverage minimums (increased from 70%)
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Define test file match patterns
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],
};

// Export the configuration wrapped by nextJest to integrate Next.js specific settings (like SWC/Babel transformation)
export default createJestConfig(customJestConfig);