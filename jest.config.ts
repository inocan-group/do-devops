import type { InitialOptionsTsJest } from "ts-jest/dist/types";
import path from "path";

const config: InitialOptionsTsJest = {
  roots: ["<rootDir>/test"],
  preset: "ts-jest/presets/js-with-ts",
  testMatch: ["/test/**/?(*)+(-spec|-test|.spec|.test).ts"],
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
