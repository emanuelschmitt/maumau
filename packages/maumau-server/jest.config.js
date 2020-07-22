module.exports = {
  name: "maumau",
  displayName: "maumau",
  rootDir: "./",
  testEnvironment: "node",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/test/tsconfig.json",
    },
  },
};
