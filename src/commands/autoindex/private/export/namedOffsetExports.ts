import { IExportableFiles, removeExtension } from "../index";

import { exportsAsEsm } from "../../../../shared";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function namedOffsetExports(exportable: IExportableFiles) {
  const contentLines: string[] = [];
  exportable.files.forEach((file) => {
    contentLines.push(
      `export * as ${removeExtension(file, true)} from "./${
        exportsAsEsm() ? removeExtension(file) + ".js" : removeExtension(file)
      }";`
    );
  });
  if (exportable.dirs.length > 0) {
    contentLines.push(`// directory exports`);
  }

  exportable.dirs.forEach((dir) => {
    contentLines.push(`export * as ${removeExtension(dir, true)} from "./${dir}/index${exportsAsEsm() ? ".js" : ""}";`);
  });

  return contentLines.join("\n");
}
