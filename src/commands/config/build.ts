import { IDoBuildConfig } from "../../@types";

export function build(): IDoBuildConfig {
  return {
    preBuildHooks: ["clean"],
    targetDirectory: "dist",
    buildTool: "tsc"
  };
}
