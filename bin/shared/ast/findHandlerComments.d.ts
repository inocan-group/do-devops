import * as recast from "recast";
/**
 * Given a file, it will look for the `handler` export
 * and return the comments associated with it. Alternatively
 * it will also look for comments associated with the `fn`
 * export.
 */
export declare function findHandlerComments(filename: string): recast.types.namedTypes.CommentLine[];
