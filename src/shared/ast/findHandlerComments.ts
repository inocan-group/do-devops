import { astParseWithTypescript, namedExports } from "./index";
import { NamedTypes } from "ast-types/gen/namedTypes";
export type CommentLine = NamedTypes["CommentLine"];

// const types = recast.types.namedTypes;
// const builders = recast.types.builders;

/**
 * Given a file, it will look for the `handler` export
 * and return the comments associated with it. Alternatively
 * it will also look for comments associated with the `fn`
 * export.
 */
export function findHandlerComments(filename: string): unknown[] {
  const ast = astParseWithTypescript(filename);
  const fn = namedExports(ast).find((i) => i.name === "fn");
  const fnComments = fn ? fn.comments.filter((i) => i.leading) : [];
  const handler = namedExports(ast).find((i) => i.name === "handler");
  const handlerComments = handler ? handler.comments.filter((i) => i.leading) : [];

  return fnComments.length > 0 ? fnComments : handlerComments.length > 0 ? handlerComments : [];
}
