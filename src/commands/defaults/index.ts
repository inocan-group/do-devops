import { IDoGlobalConfig } from "./global";
import { IDoBuildConfig } from "./build";
import { IDoDeployConfig } from "./deploy";
import { IDoSsmConfig } from "./ssm";

export interface IDoConfig {
  global: IDoGlobalConfig;

  build: IDoBuildConfig;
  deploy: IDoDeployConfig;
  ssm?: IDoSsmConfig;
}

export * from "./global";
export * from "./build";
export * from "./deploy";
export * from "./ssm";
