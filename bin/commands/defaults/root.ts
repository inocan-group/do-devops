export type IDoProjectType =
  /** a serverless project intended for a singular audience */
  | "serverless-project"
  /** a serverless library meant to be consumed by multiple audiences */
  | "serverless-library"
  /**
   * a library of typescript functions which are being exported to
   * be consumed by other JS/TS clients
   */
  | "library";

export interface IDoRootConfig {
  projectType: IDoProjectType;
}

export function root(): IDoRootConfig {
  return {
    projectType: "serverless-library"
  };
}
