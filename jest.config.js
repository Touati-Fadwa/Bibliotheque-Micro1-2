module.exports = {
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    testTimeout: 10000,
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/'
    ]
  };