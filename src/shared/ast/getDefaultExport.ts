import { IFileOrContent, isFilenameNotContent } from "src/@types";
import { DevopsError } from "src/errors";
import { readFile } from "../file";
import { astParseWithAcorn, isTypeBasedObject } from "src/shared/ast";
import { IAcornDeclaration, IExportDeclaration } from "src/@types/ast-types";

function reduce(exp: IAcornDeclaration): IExportDeclaration {
  const symbols = new Set<string>(
    exp?.callee?.loc?.tokens?.filter((t) => t?.type?.label === "name").map((i) => i.value)
  );
  return {
    defaultExport: exp?.callee?.name,
    symbols: [...symbols],
    args: exp?.callee?.loc?.tokens?.filter((t) => t.type.label === "string").map((i) => i.value),
  };
}

/**
 * Using AST, this function analyzes whether the file (or content) _has_
 * a default export and if it does, returns the tokens associated with it.
 */
export function getDefaultExport(source: IFileOrContent) {
  const content = isFilenameNotContent(source) ? readFile(source.filename) : source.content;

  if (!content) {
    throw new DevopsError(
      `invalid source content passed into getDefaultExport()`,
      `ast/invalid-source`
    );
  }

  const defaultExports: { type: unknown; declaration: IAcornDeclaration }[] =
    astParseWithAcorn(source).program?.body?.filter(
      (i: any) =>
        isTypeBasedObject<{ declaration: IAcornDeclaration }>(i) &&
        i.type === "ExportDefaultDeclaration"
    ) || [];

  if (defaultExports.length > 1) {
    throw new DevopsError(`There were MORE than one default exports!`, "ast/too-many-exports");
  }

  return defaultExports.length === 0 ? false : reduce(defaultExports[0]?.declaration);
}
