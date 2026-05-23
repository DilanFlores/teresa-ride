module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  testTimeout: 10000,
  forceExit: true,
  detectOpenHandles: true,
  moduleNameMapper: {
    "^@db$": "<rootDir>/backend/__mocks__/db.ts"
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/backend/**/*.test.ts"]
};