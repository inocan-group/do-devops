import { IExportableSymbols } from "./index";
/**
 * Determines the files and directories in a _given directory_ that should be included
 * in the index file. Files which match the
 */
export declare function exportable(filePath: string, excluded: string[]): Promise<IExportableSymbols>;
