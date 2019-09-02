import { IDictionary } from "common-types";
/**
 * Returns an array of _exports_ that a given file provides
 *
 * @param file the filename and relative path of the file being analyized
 * @param filter you can optionally provide a filter which will be run over
 * the exports so you can isolate the exports only to those you are interested in
 */
export declare function getExportsFromFile(file: string, filter?: (i: any) => boolean): Promise<IDictionary<any>>;
