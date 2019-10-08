import { parseFile, namedExports } from "./index";
import * as recast from "recast";

const types = recast.types.namedTypes;
const builders = recast.types.builders;

/**
 * Given a file, it will look for the `handler` export
 * and return the comments associated with it. Alternatively
 * it will also look for comments associated with the `fn`
 * export.
 */
export function findHandlerComments(filename: string) {
  const ast = parseFile(filename);
  const fnComments = namedExports(ast)
    .find(i => i.name === "fn")
    .comments.filter(i => i.leading);
  const handlerComments = namedExports(ast)
    .find(i => i.name === "handler")
    .comments.filter(i => i.leading);

  return fnComments.length > 0
    ? fnComments
    : handlerComments.length > 0
    ? handlerComments
    : [];
}
