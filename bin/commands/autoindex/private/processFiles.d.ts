import { IDictionary } from "common-types";
/**
 * Reach into each file and look to see if it is a "autoindex" file; if it is
 * then create the autoindex.
 */
export declare function processFiles(paths: string[], opts: IDictionary): Promise<void>;
export * from "./exclusions";
export * from "./exportable";
export * from "./index";
export * from "./processFiles";
export * from "./export/index";
export * from "./reference/index";
export * from "./util/index";
