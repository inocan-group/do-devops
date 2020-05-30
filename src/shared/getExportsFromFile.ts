import * as chalk from "chalk";
import * as path from "path";

import { IDictionary } from "common-types";

/**
 * Returns an array of _exports_ that a given file provides
 *
 * @param file the filename and relative path of the file being analyized
 * @param filter you can optionally provide a filter which will be run over
 * the exports so you can isolate the exports only to those you are interested in
 */
export async function getExportsFromFile(file: string, filter: (i: any) => boolean = () => true) {
  const srcDir = path.join(process.env.PWD, "src");

  const exports: IDictionary = await import(path.join("..", file.replace(srcDir, "").replace(".ts", "")));

  return Object.keys(exports).reduce((agg: IDictionary, key) => {
    const value = exports[key];
    if (filter(value)) {
      agg[key] = {
        symbol: key,
        type: typeof value,
        props: typeof value === "object" ? Object.keys(value) : undefined,
      };
    } else {
      console.log(chalk.grey(`- ignoring the export "${key}" due to the filter condition`));
    }

    return agg;
  }, {});
}
