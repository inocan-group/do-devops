import { IDoBuildConfig } from "../../@types";

export function build(): IDoBuildConfig {
  return {
    targetDirectory: "dist",
    buildTool: "tsc"
  };
}
