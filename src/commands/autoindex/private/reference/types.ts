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

export interface AutoindexFile {
  /** relative filename/path from base_dir or the source */
  filename: string;
  /**
   * The default export type to use
   */
  exportType: IExportType;
  /** 
   * files being exported by this index file
   */
  files: string[];
  /** 
   * Subdirectories which have an _index_ file in them (and 
   * do not declare "orphan" status)
   */
  dirs: string[];
  /**
   * Files or subdirectories which have been explicitly been excluded
   */
  exclusions: string[];
  /** 
   * Unique hash code for the given set of:
   *    - files
   *    - directories
   *    - default export type
   *    - orphan status
   *    - _and_ exclusions
   */
  hashCode: string;
}

export type AutoindexFileType = "ts" | "js" | "vue" | "jsx" | "tsx" | "md";

/**
 * **AutoindexSource**
 * 
 * A base directory which will be used to run glob searches
 * for _index_ files from.
 */
export interface AutoindexSource {
  base_dir: string;
  /**
   * The types of files which we will reference in the _index_ files.
   */
  file_types: AutoindexFileType[];
  /**
   * The **glob** patterns used to find the index files
   */
  index_globs: string[];
  /**
   * The **glob** patters used to find files in a given directory
   */
  export_globs: string[];
  index_files: AutoindexFile[];
}
