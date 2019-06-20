import { IDoGlobalConfig } from "./global";
import { IDoBuildConfig } from "./build";
import { IDoDeployConfig } from "./deploy";

export interface IDoConfig {
  global: IDoGlobalConfig;

  build: IDoBuildConfig;
  deploy: IDoDeployConfig;
}

export * from "./global";
export * from "./build";
export * from "./deploy";
