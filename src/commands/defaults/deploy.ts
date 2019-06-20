export interface IDoDeployConfig {
  preDeployHooks?: string[];
  /**
   * Which deployment target is your default
   */
  target: "serverless" | "npm" | "bespoke";
  /**
   * In many/most cases we are wrapping commands provided by
   * different libraries. Should these underlying commands be
   * displayed as part of the CLI output?
   */
  showUnderlyingCommands: boolean;
}

export function deploy(): IDoDeployConfig {
  return {
    preDeployHooks: ["clean"],
    target: "serverless",
    showUnderlyingCommands: true
  };
}
