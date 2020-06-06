import { basename, dirname, join } from "path";
import { existsSync, readdirSync } from "fs";

import { IExportableFiles } from "./index";
import globby = require("globby");

/**
 * determines the files and directories in a _given directory_ that should be included in the index file
 */
export async function exportable(filePath: string, excluded: string[]): Promise<IExportableFiles> {
  const dir = dirname(filePath);
  const thisFile = basename(filePath);
  const exclusions = excluded.concat(thisFile).concat(["index.js", "index.ts"]);
  const files = (await globby([`${dir}/*.ts`, `${dir}/*.js`]))
    .filter((file) => !exclusions.includes(basename(file)))
    .map((i) => basename(i));
  const dirs: string[] = [];
  readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isDirectory())
    .map((i) => {
      if (existsSync(join(dir, i.name, "index.ts"))) {
        dirs.push(i.name);
      } else if (existsSync(join(dir, i.name, "index.js"))) {
        dirs.push(i.name);
      }
    });
  return { files, base: dir, dirs };
}
