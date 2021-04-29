import type { Stats } from "node:fs";

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
