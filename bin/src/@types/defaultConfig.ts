import { ISandboxStrategy } from "./index";

export type IDoDeployConfig =
  | IDoDeployServerless
  | IDoDeployNpm
  | IDoDeployBespoke
  | IDoDeployUnknown;
export interface IDoDeployConfigBase {
  preDeployHooks?: string[];
  /**
   * Which deployment target is your default
   */
  target: "serverless" | "npm" | "bespoke" | "unknown";
  /**
   * In many/most cases we are wrapping commands provided by
   * different libraries. Should these underlying commands be
   * displayed as part of the CLI output?
   */
  showUnderlyingCommands: boolean;
}

export interface IDoDeployUnknown extends IDoDeployConfigBase {
  target: "unknown";
}

export interface IDoDeployServerless extends IDoDeployConfigBase {
  target: "serverless";
  /**
   * The sandboxing strategy for development deployments.
   *
   * - `dev` puts all dev deployments into the same sandbox
   * - `user` segments DEV deployments by the developers **git** username (if set)
   * - `branch` segments DEV deployments by the **git** feature branch that is being worked on
   */
  sandboxing: ISandboxStrategy;
}

export interface IDoDeployNpm extends IDoDeployConfigBase {
  target: "npm";
}

export interface IDoDeployBespoke extends IDoDeployConfigBase {
  target: "bespoke";
}
