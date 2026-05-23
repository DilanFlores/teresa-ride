module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/frontend/selenium/**/*.test.ts"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    transformIgnorePatterns: [],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testTimeout: 180000,
    maxWorkers: 1,
    bail: false,
};
