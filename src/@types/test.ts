export interface IDoTestConfig {
  unitTestFramework?: keyof typeof UnitTestFramework;
  testDirectory?: string;
  /** the glob pattern to use to find tests */
  testPattern?: string;
}

export enum UnitTestFramework {
  jest = "jest",
  mocha = "mocha",
  other = "other",
}
