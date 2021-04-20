import chalk from "chalk";
import globby from "globby";
import path from "path";

import { SpecificTestReason, askForSpecificTests } from "./askForSpecificTests";
import { emoji, getConfig, hasDevDependency } from "~/shared";

import { asyncExec } from "async-shelljs";
import { testName } from "./testName";

/** runs the Mocha command to execute the tests */
const tsExecution = async (fns: string[]) => {
  /** the tsconfig-paths npm package can provide convenient path alias which work with ts-node */
  const hasTsconfigPaths = hasDevDependency("tsconfig-paths");
  const mochaRequires = hasTsconfigPaths
    ? ["ts-node/register", "tsconfig-paths/register"]
    : ["ts-node/register"];

  // const command = `yarn mocha --no-timeouts ${mochaRequires
  //   .map((i) => `-r ${i}`)
  //   .join(" ")} --exit ${fns.join(" ")}`;

  if (hasTsconfigPaths) {
    console.log(
      chalk`- using {blue tsconfig-paths} with mocha to support path aliases. {grey remove the npm package to have this behavior stop}\n`
    );
  }
  return asyncExec(
    `yarn mocha --no-timeouts ${mochaRequires
      .map((i) => `-r ${i}`)
      .join(" ")} --exit ${fns.join(" ")}`
  );
};

const mocha = async (args: string[]) => {
  const config = await getConfig();
  const allTests = await globby([
    path.posix.join(config?.test?.testDirectory || "", config?.test?.testPattern || ""),
  ]);
  let selectedTests: string[] = [];
  if (args.length > 0) {
    for (const searchTerm of args) {
      const found = allTests.filter((t) => t.includes(searchTerm));
      if (found.length === 0) {
        console.log(
          chalk`- the {italic.blue ${searchTerm}} search term found no matches in the available tests`
        );
      } else {
        selectedTests = [...found, ...selectedTests];
      }
    }

    if (selectedTests.length === 0) {
      selectedTests = askForSpecificTests(SpecificTestReason.noResultsFound, allTests);
    }
    if (selectedTests.length === 0) {
      console.log(chalk`- no tests matched; valid tests include:\n`);
      console.log(
        chalk`{dim ${allTests
          .map((t) => testName(t, config?.test?.testPattern || "").padEnd(20))
          .join("\t")}}`
      );
    } else {
      console.log(
        chalk`- ${emoji.run} running {bold ${String(
          selectedTests.length
        )}} ({italic of} {bold ${String(
          allTests.length
        )}}) mocha tests: {grey ${selectedTests
          .map((t) => testName(t, config?.test?.testPattern || ""))
          .join(", ")}}`
      );
    }
  } else {
    selectedTests = allTests;
    if (selectedTests.length === 0) {
      console.log(
        chalk`- There were {red.bold NO} mocha unit tests in the "${config.test.testDirectory}" directory [ pattern: {grey.italic ${config.test.testPattern}} ]\n`
      );
      process.exit();
    } else {
      console.log(
        chalk`- ${emoji.run} running {italic all} {bold ${String(
          selectedTests.length
        )}} mocha tests: {grey ${selectedTests
          .map((t) => testName(t, config?.test?.testPattern || ""))
          .join(", ")}}`
      );
    }
  }
  console.log();
  await tsExecution(selectedTests).catch(() => {
    console.log(
      chalk`\n- ${emoji.angry}  tests completed but {red errors} were encountered`
    );
    process.exit(1);
  });
  console.log(chalk`- ${emoji.party}  all tests completed successfully\n`);
  process.exit();
};

export default mocha;
