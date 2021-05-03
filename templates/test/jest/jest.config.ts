import type { Config } from "@jest/types";
import { resolve } from "path";

const config: Config.InitialOptions = {
  verbose: true,
  testMatch: [TEST_MATCHER],
  moduleNameMapper: {
    "^[/]{0,1}~/(.*)$": resolve(process.cwd(), "src", "$1"),
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
};

export default config;
