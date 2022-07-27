import type { Stats } from "node:fs";

export interface IFilenameNotContent {
  /** the file's filename in the file system */
  filename: string;
  /** the contents of a file */
  content?: never;
}

export interface IContentNotFilename {
  /** the file's filename in the file system */
  filename?: never;
  /** the contents of a file */
  content: string;
}

/**
 * Allows either a `filename` or the _contents_ of a file to be represented
 */
export type IFileOrContent = IFilenameNotContent | IContentNotFilename;

export function isFilenameNotContent(input: IFileOrContent): input is IFilenameNotContent {
  return input.filename !== undefined;
}



/**
 * Optional configuration for the `file/write()` function
 */
export interface IWriteOptions {
  /**
   * By default when things are stringified, they are done with the aim of keeping file
   * size small but if you want it to be more readable you can turn this flag on and
   * the JSON string will have CR and spacing built into it.
   */
  pretty?: boolean;
  /**
   * if set to `true` it will add a numeric offset to the filename to avoid collisions
   */
  offsetIfExists?: boolean;

  /**
   * Allow the file to be overwritten if it already exists.
   */
  allowOverwrite?: boolean;
}

export interface IFileWithStats {
  file: string;
  stats: Stats;
}

/**
 * Options for all the base directory functions provided by `do-devops`
 */
export interface IDirectoryOptions {
  /** a directory path that will be joined into the root path the function starts at */
  // offset?: string;
  /**
   * if you want to work with a "relative path" from some known "base dir" this can be
   * passed in to get the relative path.
   */
  base?: string;
}


export interface IFilenameComponents {
  /**
   * The first section of the directory path;
   * if there is no directory path then it will
   * be an empty string.
   */
  start: string;
  /**
   * The sections of the directory path _other_
   * than the first part which is captured by `start`.
   * 
   * The `mid` is _only_ directory segments and is
   * an empty string where there less than two directory
   * path segments.
   */
  mid: string;
  /**
   * The filename including the file extension but _not_
   * including the directory path.
   */
  filename: string;
  /**
   * The filename with the file extension (and directory
   * path) removed.
   */
  fileWithoutExt: string;
  /**
   * The full directory path, excluding the filename.
   * 
   * Note: _equivalent to `start` + `mid`_
   */
  filepath: string;

  /**
   * the file's extension
   */
  ext: string;

  /** the full directory path, filename and extension */
  full: string;
}

export type IFileInfo = Stats & IFilenameComponents;