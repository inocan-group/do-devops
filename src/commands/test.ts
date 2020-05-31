import * as chalk from "chalk";

import { getConfig, writeSection } from "../shared";

import { IDictionary } from "common-types";
import { askForUnitTestFramework } from "./test-helpers/askForUnitTestFramework";
import { table } from "table";

export function description() {
  return `Test some or all of your tests and incorporate useful test data without effort.`;
}

export function examples() {
  return [
    'Typing "do test" by itself will search in the testing directory for all test files and run them all',
    'Typing "do test foo bar baz" will look for all test files which contain foo, bar, or baz in their name and execute them',
  ];
}

export async function handler(args: string[], opt: IDictionary) {
  let test;
  try {
    const config = await getConfig();
    if (!config.test || !config.test.unitTestFramework) {
      const unitTestFramework = await askForUnitTestFramework();

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
