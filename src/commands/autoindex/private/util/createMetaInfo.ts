import { IDictionary } from "common-types";
import { IExportableSymbols, IExportType } from "../index";
import { removeExtension } from "./removeExtension";

export function createMetaInfo(
  exportType: IExportType,
  sym: IExportableSymbols,
  exclusions: string[],
  opts: IDictionary
) {
  const output: string[] = [];

  output.push(`// export: ${exportType}; exclusions: ${exclusions.join(", ")}.`);

  if (sym.files.length > 0) {
    output.push(`// files: ${sym.files.map((i) => removeExtension(i)).join(", ")}.`);
  }
  if (sym.dirs.length > 0) {
    output.push(`// directories: ${sym.dirs.join(", ")}.`);
  }
  if (opts.sfc !== false && sym.sfcs.length > 0) {
    output.push(`// SFCs: ${sym.sfcs.map((i) => removeExtension(i)).join(", ")}.`);
  }

  return output.join("\n");
}
