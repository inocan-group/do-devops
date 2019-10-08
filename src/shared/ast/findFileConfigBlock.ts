import { parseFile, namedExports } from "./index";
import * as recast from "recast";
import get from "lodash.get";
import { IDictionary } from "common-types";

/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export.
 */
export function findHandlerConfig(filename: string) {
  const ast = parseFile(filename);
  return namedExports(ast).find(i => i.name === "config").properties;
}
