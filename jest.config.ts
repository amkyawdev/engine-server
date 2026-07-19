import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  transform": {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
        },
      },
    ],
  },
  testMatch": ['**/tests/**/*.test.ts'],
  collectCoverageFrom": [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters": ['text', 'lcov', 'html'],
};

export default config;
