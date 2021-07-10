module.exports = {
    bail: 1,
    clearMocks: true,
    collectCoverageFrom: ['src/**', '!src/interfaces/**', '!src/database/migrations/**'],
    coverageDirectory: './tests/coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
};
