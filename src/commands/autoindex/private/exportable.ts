import path from "path";
import { existsSync, readdirSync } from "fs";

import globby = require("globby");
import { IExportableSymbols } from "./index";
import { isOrphanedIndexFile, removeExtension } from "./util";

/**
 * Determines the _files_, _directories_, and _sfc_'s in a _given directory_ that should be included
 * in the index file. Files which match the
 */
export async function exportable(
  filePath: string,
  excluded: string[]
): Promise<IExportableSymbols> {
  const dir = path.posix.dirname(filePath);
  const thisFile = path.posix.basename(filePath);
  const exclusions = new Set([...excluded, ...thisFile]);
  const files = (await globby([`${dir}/*.ts`, `${dir}/*.js`]))
    .filter((file) => !exclusions.has(removeExtension(path.posix.basename(file))))
    .map((i) => path.posix.basename(i));
  const sfcs = (await globby([`${dir}/*.vue`]))
    .filter((file) => !exclusions.has(removeExtension(path.posix.basename(file))))
    .map((i) => path.posix.basename(i));

  const dirs: string[] = [];
  const orphans: string[] = [];
  readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isDirectory())
    .filter((i) => !exclusions.has(removeExtension(i.name)))
    .map((i) => {
      // directories must have a `index` file within them to considered
      // as a directory export
      const ts = path.posix.join(dir, i.name, "index.ts");
      const js = path.posix.join(dir, i.name, "index.js");
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
