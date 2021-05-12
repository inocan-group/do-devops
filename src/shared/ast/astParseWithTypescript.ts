/* eslint-disable unicorn/prefer-module */
import * as recast from "recast";
import { readFileSync } from "fs";

/**
 * parses a given file into an AST tree
 * using the recast typescript parser.
 */
export function astParseWithTypescript(filename: string) {
  const fileContents: string = readFileSync(filename, {
    encoding: "utf-8",
  });

  return filename.includes(".ts")
    ? recast.parse(fileContents, {
        parser: require("recast/parsers/typescript"),
      })
    : recast.parse(fileContents);
}
