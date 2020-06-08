import { IDictionary } from "common-types";
/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export declare function processFiles(paths: string[], opts: IDictionary): Promise<void>;
