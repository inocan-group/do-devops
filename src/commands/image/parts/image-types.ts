export interface IImageRule {
  /** the rule's name */
  name: string;
  /**
   * a relative path from the repo's root where source files will
   * gathered from
   */
  baseDir: string;
  /**
   * Indicates whether subdirectories below the `baseDir` should
   * also be considered for source images
   */
  useSubdirectories: boolean;
  /**
   * The glob pattern used to isolate the images.
   */
  globPattern: string;
  /**
   * Add meta-data sidecar files next to each image
   */
  addMetaSidecars: boolean;

  /**
   * Add a typescript file to enumerate the images contained in
   * the rule along with _basic_ meta data.
   */
  includeTSSupport: boolean;
}
