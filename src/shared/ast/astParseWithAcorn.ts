/* eslint-disable unicorn/prefer-module */
import { parse } from "recast";
import { IFileOrContent, isFilenameNotContent } from "src/@types";
import { readFile } from "../file";
import { DevopsError } from "src/errors";
// import acorn from "recast/parsers/acorn.js";

/**
 * parses a given file into an AST tree using the recast **acorn** parser.
 */
export function astParseWithAcorn(source: IFileOrContent) {
  const content = isFilenameNotContent(source) ? readFile(source.filename) : source.content;
  if (!content) {
    throw new DevopsError(
      `source passed to astParseWithAcorn() was not valid`,
      "ast/invalid-source"
    );
  }

  return parse(content, {
    // parser: acorn,
  });
}
