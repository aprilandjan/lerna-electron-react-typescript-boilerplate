// setup jest monorepo
// https://jestjs.io/docs/en/configuration#projects-arraystring--projectconfig
// https://github.com/entria/entria-fullstack/blob/master/jest.config.js
module.exports = {
  projects: ['<rootDir>/packages/*'],
  // the root matches only its test, not sub packages
  testMatch: ['<rootDir>/test/**/*.{js,jsx,ts,tsx}', '<rootDir>/test/**/*.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/scripts/testing/fileTransform.js',
  },
  setupFilesAfterEnv: ['./scripts/testing/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  // implied by each sub modules
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
};
