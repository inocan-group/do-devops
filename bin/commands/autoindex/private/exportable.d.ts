import { IExportableSymbols } from "./index";
/**
 * Determines the _files_, _directories_, and _sfc_'s in a _given directory_ that should be included
 * in the index file. Files which match the
 */
export declare function exportable(filePath: string, excluded: string[]): Promise<IExportableSymbols>;
