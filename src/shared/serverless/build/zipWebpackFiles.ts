import chalk from "chalk";
import path from "path";

import { emoji } from "../../ui";
import "~/@polyfills/bestzip";
import zip = require("bestzip");
/**
 * Zips up a number of
 *
 * @param fns a list of functions to zip
 */
export async function zipWebpackFiles(fns: string[]) {
  const promises: any[] = [];
  try {
    const fnWithPath = (f: string) => path.posix.join(".webpack", f);
    for (const fn of fns) {
      promises.push(
        zip({
          source: `./${fnWithPath(fn)}.js`,
          destination: `./${fnWithPath(fn)}.zip`,
        }).catch((error: Error) => {
          throw error;
        })
      );
    }

    return Promise.all(promises);
  } catch (error) {
    console.log(chalk`{red - Problem zipping webpack files! ${emoji.angry}}`);
    console.log(`- ${error.message}`);
    console.log(chalk`{grey \n${error.stack}}\n`);
    process.exit();
  }
}
