/* eslint-disable unicorn/prefer-module */
import { parse } from "recast";
import { readFileSync } from "node:fs";
import parser from "recast/parsers/typescript.js";

/**
 * parses a given file into an AST tree
 * using the recast typescript parser.
 */
export function astParseWithTypescript(filename: string) {
  const fileContents: string = readFileSync(filename, {
    encoding: "utf8",
  });

  return filename.includes(".ts")
    ? parse(fileContents, {
        parser,
      })
    : parse(fileContents);
}
