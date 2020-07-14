import { getConfig, writeSection, git } from "../shared";

import { IDictionary } from "common-types";
import { askForUnitTestFramework } from "./test-helpers/askForUnitTestFramework";
import chalk = require("chalk");
import { OptionDefinition } from "command-line-usage";

export function description() {
  return `Test some or all of your tests and incorporate useful test data without effort.`;
}

export function examples() {
  return [
    'Typing "do test" by itself will search in the testing directory for all test files and run them all',
    'Typing "do test foo bar baz" will look for all test files which contain foo, bar, or baz in their name and execute them',
  ];
}

export const options: OptionDefinition[] = [
  {
    name: "onSourceChanged",
    type: Boolean,
    group: "test",
    description: `only run tests if the source files in the repo are changed from what is in git`,
  },
];

export async function handler(args: string[], opt: IDictionary) {
  let test;
  try {
    const config = await getConfig();
    if (!config.test || !config.test.unitTestFramework) {
      const unitTestFramework = await askForUnitTestFramework();
      const g = git();
      const sourceFiles = (await g.status()).files.map((f) => f.path).filter((p) => p.includes("src/"));
      if (sourceFiles.length === 0 && opt.onSourceChanged) {
        console.log(chalk`- skipping tests because no {italic source} files were changed!`);
        process.exit();
      }

      await writeSection("test", { ...config.test, ...unitTestFramework }, "project");
    }

    if (config?.test.unitTestFramework === "mocha") {
      test = (await import("./test-helpers/mocha")).default;
    } else if (config?.test.unitTestFramework === "jest") {
      test = (await import("./test-helpers/jest")).default;
    } else {
      test = (await import("./test-helpers/other")).default;
    }

    await test(args);
  } catch (e) {
    console.log(`- Error finding functions: ${e.message}\n`);
    process.exit();
  }
}
