// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**/*.{ts,tsx,mjs}"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: ['(/__tests__/.*|(\\.|/)(unittest.*.spec))\\.[jt]sx?$'],

  // A map from regular expressions to paths to transformers
  transform: {"^.+\\.[jt]sx?$": "ts-jest"},

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
}
