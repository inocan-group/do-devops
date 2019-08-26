import { ISandboxStrategy } from "../../shared/@types";

export interface IDoPkgConfig {
  preDeployHooks?: string[];
  /**
   * In many/most cases we are wrapping commands provided by
   * different libraries. Should these underlying commands be
   * displayed as part of the CLI output?
   */
  showUnderlyingCommands: boolean;
}

export function pkg(): IDoPkgConfig {
  return {
    preDeployHooks: ["clean"],
    showUnderlyingCommands: true
  };
}
