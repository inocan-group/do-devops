import zip from "bestzip";
import { join } from "path";
import chalk from "chalk";
import { emoji } from "../../ui";
/**
 * Zips up a number of
 *
 * @param fns a list of functions to zip
 */
export async function zipWebpackFiles(fns: string[]) {
  const promises: any[] = [];
  try {
    const fnWithPath = (f: string) => join(".webpack", f);
    fns.forEach(fn =>
      promises.push(
        zip({
          source: `./${fnWithPath(fn)}.js`,
          destination: `./${fnWithPath(fn)}.zip`
        }).catch((e: Error) => {
          throw e;
        })
      )
    );

    return Promise.all(promises);
  } catch (e) {
    console.log(chalk`{red - Problem zipping webpack files! ${emoji.angry}}`);
    console.log(`- ${e.message}`);
    console.log(chalk`{grey \n${e.stack}}\n`);
    process.exit();
  }
}
