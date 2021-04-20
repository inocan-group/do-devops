import inquirer = require("inquirer");

import { IDictionary } from "common-types";
import { getPackageJson } from "~/shared/npm";

/**
 * Asks the user to choose an AWS profile
 */
export async function askForUnitTestFramework(): Promise<IDictionary<string>> {
  const devDeps = Object.keys(getPackageJson().devDependencies || {});
  const testFrameworks = ["mocha", "jest", "other"];

  const defaultFramework = devDeps.includes("mocha")
    ? "mocha"
    : devDeps.includes("jest")
    ? "jest"
    : "other";

  const framework: inquirer.ListQuestion = {
    name: "unitTestFramework",
    type: "list",
    choices: testFrameworks,
    message: "choose the unit testing framework you are using",
    default: defaultFramework,
    when: () => true,
  };

  const testLocations = ["test", "tests", "other"];

  const testLocation: inquirer.ListQuestion = {
    name: "testDirectory",
    type: "list",
    choices: testLocations,
    message: "choose the unit testing framework you are using",
    default: "test",
    when: () => true,
  };

  const testPatterns = [
    "**/*-spec.ts",
    "**/*.spec.ts",
    "**/*-test.ts",
    "**/*.test.ts",
    "**/*-spec.js",
    "**/*.spec.js",
    "**/*-test.js",
    "**/*.test.js",
  ];

  const testPattern: inquirer.ListQuestion = {
    name: "testPattern",
    type: "list",
    choices: testPatterns,
    message: "what pattern should identify a test file versus just a normal file",
    default: "**/*-spec.ts",
    when: () => true,
  };

  let answer = await inquirer.prompt([framework, testLocation, testPattern]);

  if (answer.testLocation === "other") {
    const freeformLocation: inquirer.InputQuestion = {
      name: "testDirectory",
      type: "input",
      message: "What is the path to your tests?",
    };

    answer = { ...answer, ...(await inquirer.prompt(freeformLocation)) };
  }

  return answer;
}
