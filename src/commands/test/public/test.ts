import { IDictionary } from "common-types";
import { getConfig, git, writeSection } from "../../../shared";
import { askForUnitTestFramework } from "../private";
import chalk from "chalk";

export async function handler(args: string[], opt: IDictionary) {
  let test;
  try {
    const config = await getConfig();
    if (!config.test || !config.test.unitTestFramework) {
      const unitTestFramework = await askForUnitTestFramework();
      const g = git();
      const sourceFiles = (await g.status()).files
        .map((f) => f.path)
        .filter((p) => p.includes("src/"));
      if (sourceFiles.length === 0 && opt.onSourceChanged) {
        console.log(
          chalk`- skipping tests because no {italic source} files were changed!`
        );
        process.exit();
      }

      await writeSection("test", { ...config.test, ...unitTestFramework }, "project");
    }

    if (config?.test.unitTestFramework === "mocha") {
      test = (await import("../private/mocha")).default;
    } else if (config?.test.unitTestFramework === "jest") {
      test = (await import("../private/jest")).default;
    } else {
      test = (await import("../private/other")).default;
    }

    await test(args);
  } catch (error) {
    console.log(`- Error finding functions: ${error.message}\n`);
    process.exit();
  }
}
