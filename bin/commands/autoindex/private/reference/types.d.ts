export interface IExportableSymbols {
    /** files which being exported */
    files: string[];
    /** directories which have an index.ts in them */
    dirs: string[];
    /** base directory which search was done in */
    base: string;
}
export declare enum ExportAction {
    updated = 0,
    added = 1,
    noChange = 2
}
export declare enum ExportType {
    default = "default",
    named = "named",
    namedOffset = "namedOffset"
}
export declare type IExportType = keyof typeof ExportType;
