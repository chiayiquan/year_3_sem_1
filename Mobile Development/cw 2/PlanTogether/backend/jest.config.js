module.exports = {
  testRegex: ["\\.spec\\.ts$"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  testEnvironment: "<rootDir>/specs/testEnvironment.js",
  preset: "ts-jest",
  setupFiles: ["<rootDir>/specs/setupFiles.js"],
  globals: {
    "ts-jest": { tsconfig: "tsconfig.json" },
  },
};
