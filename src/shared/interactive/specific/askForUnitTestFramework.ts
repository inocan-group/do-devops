
import { equal } from "native-dash";

import { ICommandConfig, Options, TestObservation } from "src/@types";
import { TEST_FRAMEWORKS } from "src/constants";
import { getUserConfig, saveUserConfig } from "src/shared/config";
import { logger } from "src/shared/core";
import { dirExists } from "src/shared/file";
import { askCheckboxQuestion, askConfirmQuestion, askListQuestion } from "src/shared/interactive";

/**
 * Asks user about the testing framework they wish to use and other test meta-data.
 * The answer returned is `false` if user opts to quit but other otherwise will fulfill
 * the **test** configuration requirements.
 */
export async function askForUnitTestFramework(
  opts: Options<{ unitTestFramework: TestObservation }> = {}
): Promise<ICommandConfig["test"] | false> {
  const log = logger(opts);

  log.shout(
    `- we have not been able to determine which {italic unit testing} framework you're using.`
  );

  const framework = opts.unitTestFramework ?? (await askListQuestion("Choose the unit test runner you'd like to use", TEST_FRAMEWORKS, {
        default: "vitest",
      }));

  const wallaby =
    framework === "uvu"
      ? false
      : await askConfirmQuestion(
          "Would you like us to add a WallabyJS config file so you can use it as a test runner in this repo?"
        );

  const defaultDir = dirExists("./tests") ? "tests" : dirExists("./test") ? "test" : "tests";

  const directory = await askListQuestion(
    "Which directory will you put your tests in?",
    ["test", "tests", "src"] as const,
    { default: defaultDir }
  );

  const user = getUserConfig();
  const defaultPostfix = user.test?.testFilePostfix ?? ["-spec", "-test"];

  const postfix = await askCheckboxQuestion(
    "Test files are typically distinguished by having a 'postfix' part of their name to distinguish them from other files in the same directory; choose as many as you like",
    ["-spec", "-test", ".spec", ".test"],
    { when: () => framework !== "uvu", default: defaultPostfix }
  );

  if (!equal(postfix, defaultPostfix)) {
    const saveToProfile = await askConfirmQuestion(
      "Would you like to save this postfix as your default?"
    );
    if (saveToProfile) {
      saveUserConfig({ test: { testFilePostfix: postfix } });
    }
  }

  return {
    unitTestFramework: framework,
    useWallaby: wallaby,
    testDirectory: directory,
    testFilePostfix: postfix || [],
  };
}
