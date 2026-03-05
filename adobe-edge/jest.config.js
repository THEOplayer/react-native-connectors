/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@theoplayer/react-native-analytics-adobe-edge$': '<rootDir>/src/index',
  },
};

