export interface IExportableFiles {
  /** files which being exported */
  files: string[];
  /** directories which have an index.ts in them */
  dirs: string[];
  /** base directory which search was done in */
  base: string;
}

export enum ExportAction {
  updated,
  added,
  noChange,
}

export enum ExportType {
  default = "default",
  named = "named",
  namedOffset = "namedOffset",
}

export type IExportType = keyof typeof ExportType;
