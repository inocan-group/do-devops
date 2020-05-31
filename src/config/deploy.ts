import { IDoDeployConfig } from "../@types";

export function deploy(): IDoDeployConfig {
  return {
    target: "serverless",
    showUnderlyingCommands: true,
    sandboxing: "user",
  };
}
