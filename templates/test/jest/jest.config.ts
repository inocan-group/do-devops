import type { Config } from "@jest/types";
import path from "path";

const config: Config.InitialOptions = {
  verbose: true,
  roots: ["<rootDir>/TEST_DIR"],
  testMatch: TEST_MATCHER,
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
