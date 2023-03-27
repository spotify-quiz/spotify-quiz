const nextJest = require("next/jest");
const createJestConfig = nextJest({
    dir: "./",
});
const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testEnvironment: "jest-environment-jsdom",
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageReporters: ['text', 'cobertura'],
    testMatch: [
      "**/__tests__/**/?(*._)+(spec|test).[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
};
module.exports = createJestConfig(customJestConfig);