/**
 * File info about serverless handlers going through
 * a webpack build pipeline.
 */
export interface IWebpackHandlerDates {
  /** the function name (no _path_ or _file extension_) */
  fn: string;
  /**
   * the fully qualified _path_ and _filename_ to the source file
   */
  source: string;
  /**
   * date/time the source file was last modified
   */
  sourceModified: Date;
  /**
   * the fully qualified _path_ and _filename_ to the **webpack** transpiled file;
   * blank if this doesn't exist
   */
  webpack: string;
  /**
   * the date/time the transpiled file was last modified
   */
  webpackModified: Date;
}
