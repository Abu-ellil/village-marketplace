module.exports = {
  preset: "react-native",

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],

  setupFiles: ["<rootDir>/jestSetup.js"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "api/routes/test.js"],
};
