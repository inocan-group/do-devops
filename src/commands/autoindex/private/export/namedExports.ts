import { IExportableSymbols, removeExtension } from "../index";

import { IDictionary } from "common-types";
import { exportsAsEsm } from "../../../../shared";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function namedExports(exportable: IExportableSymbols, opts: IDictionary = {}) {
  const contentLines: string[] = [];
  if (exportable.files.length > 0) {
    contentLines.push(`// local file exports`);
  }
  exportable.files.forEach((file) => {
    contentLines.push(
      `export * from "./${opts.preserveExtension ? removeExtension(file) + ".js" : removeExtension(file)}";`
    );
  });
  if (exportable.dirs.length > 0) {
    contentLines.push(`// directory exports`);
  }
  exportable.dirs.forEach((dir) => {
    contentLines.push(`export * from "./${dir}/index${opts.preserveExtension ? ".js" : ""}";`);
  });

  return contentLines.join("\n");
}
