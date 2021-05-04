import type { InitialOptionsTsJest } from "ts-jest/dist/types";
import path from "path";

const config: InitialOptionsTsJest = {
  verbose: true,
  preset: "ts-jest/presets/js-with-ts",
  testMatch: [process.cwd() + "/test/**/?(*)+(-spec|-test|.spec|.test).ts"],
  moduleNameMapper: {
    "^[/]{0,1}~/(.*)$": path.resolve(process.cwd(), "src", "$1"),
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
};

export default config;
