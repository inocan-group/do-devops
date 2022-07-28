/* eslint-disable unicorn/prefer-module */
import * as recast from "recast";
import { IFileOrContent, isFilenameNotContent } from "src/@types";
import { readFile } from "../file";
import { DevopsError } from "src/errors";

/**
 * parses a given file into an AST tree using the recast **acorn** parser.
 */
export function astParseWithAcorn(source: IFileOrContent) {
  const content = isFilenameNotContent(source) ? readFile(source.filename) : source.content;
  if (!content) {
    throw new DevopsError(
      `source passed to astParseWithAcron() was not valid`,
      "ast/invalid-source"
    );
  }

  return recast.parse(content, {
    parser: require("recast/parsers/acorn"),
  });
}
