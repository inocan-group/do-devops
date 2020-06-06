export interface IExportableFiles {
    /** files which being exported */
    files: string[];
    /** directories which have an index.ts in them */
    dirs: string[];
    /** base directory which search was done in */
    base: string;
}
