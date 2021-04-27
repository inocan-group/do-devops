import chalk from "chalk";

import { TestObservation } from "~/@types";
import { TEST_FRAMEWORKS } from "~/constants";
import { ask, confirmQuestion, listQuestion } from "~/shared";

export interface ITestFrameworkAnswer {
  /** the test framework */
  fw: TestObservation;
  installed: boolean;
  /** using wallaby or not */
  useWallaby: false;
}

/**
 * A user ends up here if:
 *
 * - they've run `dd build` but never run the command before in the repo
 * - they do they have _hints_ in terms of dev dependencies about what tool is being used
 * - basically we can assume that the user has a pretty clean slate wrt to testing
 * but that they _do_ have a package.json file.
 */
export async function askForUnitTestFramework(): Promise<ITestFrameworkAnswer | false> {
  // const pkg = getPackageJson();
  // const devDeps = Object.keys(pkg.devDependencies || {});
  const fwChoices: Array<TestObservation | "quit"> = [...TEST_FRAMEWORKS, "quit"];

  console.log(
    chalk`- we have not been able to determine which {italic unit testing} framework you're using.`
  );

  const framework = listQuestion(
    "fw",
    "Choose the framework you'd like to use (or 'quit')",
    fwChoices,
    "jest"
  );

  const install = confirmQuestion(
    "installed",
    "Would you like us to install that for you now?"
  );

  const wallaby = confirmQuestion(
    "useWallaby",
    "Would you like us to add a WallabyJS config file so you can use it as a test runner in this repo?"
  );

  const patterns = [
    "**/*[-.]spec.ts",
    "**/*[-.]test.ts",
    "**/*[-.](test|spec).ts",
    "test/**/*.ts",
    "tests/**/*.ts",
  ];

  const testPatterns = listQuestion(
    "testPattern",
    "Unit test runners use a regular expression to identify what files are tests; which one do you prefer?",
    ["SKIP FOR NOW", ...patterns],
    "**/*[-.]spec.ts"
  );

  const { fw, installed, useWallaby } = await ask([
    framework,
    install,
    wallaby,
    testPatterns,
  ]);

  return {
    fw: fw !== "skip" ? fw : false,
    installed,
    useWallaby,
  };
}
