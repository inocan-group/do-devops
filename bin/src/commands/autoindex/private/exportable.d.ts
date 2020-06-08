import { IExportableFiles } from "./index";
/**
 * determines the files and directories in a _given directory_ that should be included in the index file
 */
export declare function exportable(filePath: string, excluded: string[]): Promise<IExportableFiles>;
