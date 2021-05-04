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

  const defaultDir = dirExists("./tests") ? "tests" : dirExists("./test") ? "test" : "tests";

  const directory = listQuestion(
    "testDirectory",
    "Which directory will you put your tests in?",
    ["test", "tests", "src"],
    { default: defaultDir }
  );
  const postfix = listQuestion(
    "postfix",
    "Test files are typically distinguished by having a 'postfix' part of their name to distinguish them from other files in the same directory",
    ["-spec", "-test", { name: "none", value: undefined }],
    { when: (c) => c.unitTestFramework !== "uvu" }
  );

  const { unitTestFramework, useWallaby, testDirectory, testFilePostfix } = await ask([
    framework,
    wallaby,
    directory,
    postfix,
  ]);

  return unitTestFramework !== "skip"
    ? false
    : {
        unitTestFramework,
        useWallaby,
        testDirectory,
        testFilePostfix,
      };
}
