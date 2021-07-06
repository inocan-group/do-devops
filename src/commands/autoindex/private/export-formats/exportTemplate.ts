import { IExportableSymbols, removeExtension } from "../index";

import { IDictionary } from "common-types";
export interface IExportCallbacks {
  file?: (file: string) => string;
  postFile?: () => string;
  dir?: (dir: string) => string;
  postDir?: () => string;
}

/**
 * The general template used for all export types.
 *
 * Uses passed in templates for file and directory exports
 * but then also adds any SFC files because this format is
 * unrelated to the chosen export type.
 */
export function exportTemplate(
  exportable: IExportableSymbols,
  opts: IDictionary = {},
  callbacks: IExportCallbacks
) {
  const contentLines: string[] = [];
  if (exportable.files.length > 0) {
    contentLines.push("\n// local file exports");

    if (callbacks.file) {
      for (const file of exportable.files) {
        contentLines.push(callbacks.file(file));
      }
    } else {
      contentLines.push("// the export strategy chosen does not write file exports");
    }
  }

  // if the command line switch for Vue SFC's is turned on
  if (opts.sfc !== false && exportable.sfcs.length > 0) {
    contentLines.push("\n// SFC components");
    for (const sfc of exportable.sfcs) {
      contentLines.push(`export { default as ${removeExtension(sfc)} } from "./${sfc}";`);
    }
  }

  if (exportable.dirs.length > 0) {
    contentLines.push("\n// directory exports");
  }
  if (callbacks.dir) {
    for (const dir of exportable.dirs) {
      contentLines.push(callbacks.dir(dir));
    }
  } else {
    contentLines.push(
      "// the export strategy chosen does not write directories to this file"
    );
  }

  if ((exportable?.orphans || []).length > 0) {
    contentLines.push(
      `\n// there were directories orphaned: ${(exportable.orphans || []).join(", ")}`
    );
  }

  return contentLines.join("\n");
}
