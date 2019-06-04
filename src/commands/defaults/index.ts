import { IDoRootConfig } from "./root";
import { IDoBuildConfig } from "./build";
import { IDoDeployConfig } from "./deploy";

export interface IDoConfig extends IDoRootConfig {
  build: IDoBuildConfig;
  deploy: IDoDeployConfig;
}

export * from "./root";
export * from "./build";
export * from "./deploy";
