export interface IExportableSymbols {
  /** files which being exported */
  files: string[];
  /** directories which have an index.ts in them */
  dirs: string[];
  /** base directory which search was done in */
  base: string;
  /**
   * Any VueJS SFC files (aka, files ending in .vue which combine JS,CSS,Styles and result in a
   * single JS default export when transpiled)
   */
  sfcs: string[];
}

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
