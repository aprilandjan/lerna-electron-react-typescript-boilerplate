// setup jest monorepo
// https://jestjs.io/docs/en/configuration#projects-arraystring--projectconfig
// https://github.com/entria/entria-fullstack/blob/master/jest.config.js
module.exports = {
  projects: ['<rootDir>/packages/*'],
  // the root matches only its test, not sub packages
  testMatch: ['<rootDir>/test/**/*.{js,jsx,ts,tsx}', '<rootDir>/test/**/*.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/release/', '/dist/', '/build/'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  // transform: {
  //   '^(?!.*\\.(js|jsx|ts|tsx|css|)$)': 'identity-obj-proxy',
  //   '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  //   '^.+\\.[t|j]sx?$': 'babel-jest',
  // },
  setupFilesAfterEnv: ['./scripts/testing/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  // implied by each sub modules
  moduleNameMapper: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|)$)': 'identity-obj-proxy',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
};
