import { basename, dirname, posix } from "path";
import { existsSync, readdirSync } from "fs";

import { IExportableSymbols } from "./index";
import { isOrphanedIndexFile, removeExtension } from "./util";

import globby = require("globby");

/**
 * Determines the _files_, _directories_, and _sfc_'s in a _given directory_ that should be included
 * in the index file. Files which match the
 */
export async function exportable(
  filePath: string,
  excluded: string[]
): Promise<IExportableSymbols> {
  const dir = posix.dirname(filePath);
  const thisFile = posix.basename(filePath);
  const exclusions = excluded.concat(thisFile);
  const files = (await globby([`${dir}/*.ts`, `${dir}/*.js`]))
    .filter((file) => !exclusions.includes(removeExtension(basename(file))))
    .map((i) => basename(i));
  const sfcs = (await globby([`${dir}/*.vue`]))
    .filter((file) => !exclusions.includes(removeExtension(basename(file))))
    .map((i) => basename(i));

  const dirs: string[] = [];
  const orphans: string[] = [];
  readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isDirectory())
    .filter((i) => !exclusions.includes(removeExtension(i.name)))
    .map((i) => {
      // directories must have a `index` file within them to considered
      // as a directory export
      const ts = posix.join(dir, i.name, "index.ts");
      const js = posix.join(dir, i.name, "index.js");
      if (existsSync(ts)) {
        if (!isOrphanedIndexFile(ts)) {
          dirs.push(i.name);
        } else {
          orphans.push(i.name);
        }
      } else if (existsSync(js)) {
        if (!isOrphanedIndexFile(js)) {
          dirs.push(i.name);
        } else {
          orphans.push(i.name);
        }
      }
    });
  return { files, base: dir, dirs, sfcs, orphans };
}
