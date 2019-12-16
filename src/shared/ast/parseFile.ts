import * as recast from "recast";
import { readFileSync } from "fs";

/**
 * parses a given file (_path_ and _file_ name) into an AST
 * tree
 */
export function parseFile(filename: string) {
  const fileContents: string = readFileSync(filename, {
    encoding: "utf-8"
  });

  return filename.includes(".ts")
    ? recast.parse(fileContents, {
        parser: require("recast/parsers/typescript")
      })
    : recast.parse(fileContents);
}
