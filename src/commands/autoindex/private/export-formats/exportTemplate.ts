import { IExportableSymbols, removeExtension } from "../index";

import { IDictionary } from "common-types";

/**
 * the general template used for all export types
 */
export function exportTemplate(
  exportable: IExportableSymbols,
  opts: IDictionary = {},
  fileFn: (file: string) => string,
  dirFn: (dir: string) => string
) {
  const contentLines: string[] = [];
  if (exportable.files.length > 0) {
    contentLines.push(`\n// local file exports`);
  }
  exportable.files.forEach((file) => {
    contentLines.push(fileFn(file));
  });

  // if the command line switch for Vue SFC's is turned on
  if (opts.sfc && exportable.sfcs.length > 0) {
    contentLines.push(`\n// SFC components`);
    exportable.sfcs.forEach((sfc) => contentLines.push(`export { default as ${removeExtension(sfc)} } from "${sfc}";`));
  }

  if (exportable.dirs.length > 0) {
    contentLines.push(`\n// directory exports`);
  }
  exportable.dirs.forEach((dir) => {
    contentLines.push(dirFn(dir));
  });

  return contentLines.join("\n");
}
