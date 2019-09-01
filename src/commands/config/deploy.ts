import { IDoDeployConfig } from "../../@types";

export function deploy(): IDoDeployConfig {
  return {
    preDeployHooks: ["clean"],
    target: "serverless",
    showUnderlyingCommands: true,
    sandboxing: "user"
  };
}
