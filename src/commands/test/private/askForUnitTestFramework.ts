import chalk from "chalk";
import { IDictionary } from "common-types";

import { ICommandConfig, IGlobalOptions, TestObservation } from "~/@types";
import { TEST_FRAMEWORKS } from "~/constants";
import { logger } from "~/shared/core";
import { dirExists } from "~/shared/file";
import { ask, confirmQuestion, listQuestion } from "~/shared/interactive";

/**
 * Asks user about the testing framework they wish to use and other test meta-data.
 * The answer returned is `false` if user opts to quit but other otherwise will fulfill
 * the **test** configuration requirements.
 */
export async function askForUnitTestFramework(
  opts: IGlobalOptions<{ unitTestFramework: TestObservation }> = {}
): Promise<ICommandConfig["test"] | false> {
  const log = logger(opts);
  const fwChoices: Array<TestObservation | "quit"> = [...TEST_FRAMEWORKS, "quit"];

  log.shout(
    chalk`- we have not been able to determine which {italic unit testing} framework you're using.`
  );

  const framework = listQuestion(
    "unitTestFramework",
    "Choose the framework you'd like to use (or 'quit')",
    fwChoices,
    { default: opts.unitTestFramework || "jest", when: () => !opts.unitTestFramework }
  );

  const wallaby = confirmQuestion(
    "useWallaby",
    "Would you like us to add a WallabyJS config file so you can use it as a test runner in this repo?",
    {
      when: (c) => c.unitTestFramework !== "uvu",
      default: (c: IDictionary) => (c.unitTestFramework === "uvu" ? false : true),
    }
  );

  const patternLookup = {
    test: chalk`Any {inverse *-spec.ts} or {inverse *-test.ts} file in the {italic test} directory`,
    tests: chalk`Any {inverse *-spec.ts} or {inverse *-test.ts} file in the {italic tests} directory`,
    src: chalk`Any {inverse *-spec.ts} or {inverse *-test.ts} file in the {italic src} directory`,
  };

  const defaultDir: keyof typeof patternLookup = dirExists("./tests")
    ? "tests"
    : dirExists("./test")
    ? "test"
    : "tests";

  const patterns = [
    { [patternLookup.test]: ["**/test/**/?(*-)+(spec|test).ts"] },
    { [patternLookup.tests]: ["**/tests/**/?(*-)+(spec|test).ts"] },
    { [patternLookup.src]: ["**/src/**/?(*-)+(spec|test).ts"] },
  ];

  const testPatterns = listQuestion(
    "testPattern",
    "Unit test runners use a regular expression to identify what files are tests; which do you prefer?",
    patterns,
    { default: patterns.find((i) => Object.keys(i).includes(patternLookup[defaultDir])) }
  );

  const { unitTestFramework, useWallaby, testPattern } = await ask([
    framework,
    wallaby,
    testPatterns,
  ]);

  return unitTestFramework !== "skip"
    ? false
    : {
        unitTestFramework,
        useWallaby,
        testPattern,
      };
}
