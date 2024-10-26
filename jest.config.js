module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom', // 确保这里是正确的
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    roots: ['<rootDir>/src/tests'],
    moduleFileExtensions: ['js', 'ts', 'ts', 'json', 'node'],
    transform: {
      '^.+\\.ts': 'ts-jest',
    },
  };
  