import chalk from "chalk";

import { ICommandConfig, IGlobalOptions, TestObservation } from "~/@types";
import { TEST_FRAMEWORKS } from "~/constants";
import { logger } from "~/shared/core";
import { dirExists } from "~/shared/file";
import { askConfirmQuestion, askListQuestion } from "~/shared/interactive";

/**
 * Asks user about the testing framework they wish to use and other test meta-data.
 * The answer returned is `false` if user opts to quit but other otherwise will fulfill
 * the **test** configuration requirements.
 */
export async function askForUnitTestFramework(
  opts: IGlobalOptions<{ unitTestFramework: TestObservation }> = {}
): Promise<ICommandConfig["test"] | false> {
  const log = logger(opts);

  log.shout(
    chalk`- we have not been able to determine which {italic unit testing} framework you're using.`
  );

  const framework = opts.unitTestFramework
    ? opts.unitTestFramework
    : await askListQuestion<TestObservation>(
        "Choose the unit test runner you'd like to use",
        TEST_FRAMEWORKS,
        { default: "jest" }
      );

  const wallaby =
    framework === "uvu"
      ? false
      : await askConfirmQuestion(
          "Would you like us to add a WallabyJS config file so you can use it as a test runner in this repo?"
        );

  const defaultDir = dirExists("./tests") ? "tests" : dirExists("./test") ? "test" : "tests";

  const directory = await askListQuestion<string>(
    "Which directory will you put your tests in?",
    ["test", "tests", "src"],
    { default: defaultDir }
  );
  const postfix = await askListQuestion<string>(
    "Test files are typically distinguished by having a 'postfix' part of their name to distinguish them from other files in the same directory",
    ["-spec", "-test", { name: "none", value: undefined }],
    { when: (c) => c.unitTestFramework !== "uvu" }
  );

  return {
    unitTestFramework: framework,
    useWallaby: wallaby,
    testDirectory: directory,
    testFilePostfix: postfix,
  };
}
