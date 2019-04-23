export interface IDoDeployConfig {
  preDeployHooks?: string[];
  /**
   * Which tool are you using for running your build pipeline?
   */
  deployTool: "serverless" | "npm" | "bespoke";
}

export function deploy(): IDoDeployConfig {
  return {
    preDeployHooks: ["clean"],
    deployTool: "serverless"
  };
}
