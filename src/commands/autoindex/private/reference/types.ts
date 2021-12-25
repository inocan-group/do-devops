export enum ExportAction {
  updated,
  added,
  noChange,
  refactor,
}

export enum ExportType {
  /** export the default export as the name of the file */
  default = "default",
  /** export all named exports from files and directories (with another index file) */
  named = "named",
  /** export all  */
  namedOffset = "namedOffset",
}

export type IExportType = keyof typeof ExportType;

export interface IAutoindexFile {
  exportType: IExportType;
  /** files which being exported */
  files: string[];
  /** directories which have an index.ts in them */
  dirs: string[];
  /** unique hash code for the given set of files, directories, and  */
  hashCode: string;
}
