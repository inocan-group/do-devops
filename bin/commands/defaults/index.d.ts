import { IDoGlobalConfig } from "./global";
import { IDoBuildConfig } from "./build";
import { IDoDeployConfig } from "./deploy";
import { IDoSsmConfig } from "./ssm";
import { IDoPkgConfig } from "./pkg";
export interface IDoConfig {
    global: IDoGlobalConfig;
    build: IDoBuildConfig;
    deploy: IDoDeployConfig;
    ssm?: IDoSsmConfig;
    pkg?: IDoPkgConfig;
}
export * from "./global";
export * from "./build";
export * from "./deploy";
export * from "./pkg";
export * from "./ssm";
export * from "./fns";
