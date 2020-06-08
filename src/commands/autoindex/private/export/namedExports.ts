import { IExportableSymbols, removeExtension } from "../index";

import { exportsAsEsm } from "../../../../shared";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function namedExports(exportable: IExportableSymbols) {
  const contentLines: string[] = [];
  if (exportable.files.length > 0) {
    contentLines.push(`// local file exports`);
  }
  exportable.files.forEach((file) => {
    contentLines.push(`export * from "./${exportsAsEsm() ? removeExtension(file) + ".js" : removeExtension(file)}";`);
  });
  if (exportable.dirs.length > 0) {
    contentLines.push(`// directory exports`);
  }
  exportable.dirs.forEach((dir) => {
    contentLines.push(`export * from "./${dir}/index${exportsAsEsm() ? ".js" : ""}";`);
  });

  return contentLines.join("\n");
}
