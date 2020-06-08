import { IDictionary } from "common-types";

/**
 * Looks for content that typically should not be in a index file so
 * it can be communicated to the user
 */
export function unexpectedContent(fileContent: string) {
  const warnings: IDictionary<boolean> = {};
  if (fileContent.includes("export type") || fileContent.includes("export interface")) {
    warnings["inline interfaces"] = true;
  }
  if (fileContent.includes("import ")) {
    warnings.imports = true;
  }
  if (fileContent.includes("enum ")) {
    warnings.enums = true;
  }
  if (fileContent.includes("function ")) {
    warnings.functions = true;
  }

  return Object.keys(warnings).length > 0 ? warnings : false;
}
