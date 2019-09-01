import { IDoPkgConfig } from "../../@types";

export function pkg(): IDoPkgConfig {
  return {
    preDeployHooks: ["clean"],
    showUnderlyingCommands: true
  };
}
