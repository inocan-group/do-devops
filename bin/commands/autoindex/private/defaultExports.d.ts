import { IExportableFiles } from "./index";
/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export declare function defaultExports(exportable: IExportableFiles): string;
