export type IDoProjectType =
  /** a serverless project intended for a singular audience */
  | "serverless-project"
  /** a serverless library meant to be consumed by multiple audiences */
  | "serverless-library"
  /**
   * a library of typescript functions which are being exported to
   * be consumed by other JS/TS clients
   */
  | "library"
  | "vuejs-app";

export interface IDoGlobalConfig {
  projectType: IDoProjectType;
}

export function root(): IDoGlobalConfig {
  return {
    projectType: "serverless-library"
  };
}
