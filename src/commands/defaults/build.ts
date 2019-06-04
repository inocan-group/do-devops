export interface IDoBuildConfig {
  preBuildHooks?: string[];
  /**
   * the directory your build tooling will put the target
   * distribution
   */
  targetDirectory: string;

  /**
   * Which tool are you using for running your build pipeline?
   */
  buildTool: "tsc" | "webpack" | "rollup" | "bili" | "bespoke";
  /**
   * If you are using a _bespoke_ build tool then you set it here
   */
  bespokeCommand?: string;
}

export function build(): IDoBuildConfig {
  return {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
  };
}
