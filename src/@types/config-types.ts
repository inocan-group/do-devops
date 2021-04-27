import { AwsRegion, IDictionary } from "common-types";
import { NotDefined } from "./general";
import { PackageManagerObservation, TestObservation } from "./observations";

export interface IGeneralConfig {
  /**
   * General/shared configuraiton across commands
   */
  general: {
    /**
     * the default package manager to use if other means aren't
     * available to determine.
     */
    pkgManager?: PackageManagerObservation;
    /**
     * A default AWS _region_ to use for if other means fail to identify
     * the region.
     */
    defaultAwsRegion?: AwsRegion;

    /**
     * A default _profile_ to use for AWS if other means fail to identify
     * the profile name.
     */
    defaultAwsProfile?: string;
  };
}

export interface ICommandConfig {
  autoindex?: {};
  awsid?: {};
  build?: {};
  deploy?: {};
  endpoints?: {};
  fns?: {};
  info?: {};
  invoke?: {};
  latest?: {};
  layers?: {};
  pkg?: {};
  ssm?: {};
  test?: {
    unitTestFramework: TestObservation;
  };
}

export type IProjectConfigFilled = {
  kind: "project";
  /** indicates whether the project config file exists */
  projectConfig: true;
} & ICommandConfig &
  IGeneralConfig;

export type IProjectConfigUnfilled = {
  kind: "project";
  projectConfig: false;
} & NotDefined<ICommandConfig> &
  NotDefined<IGeneralConfig>;

export type IProjectConfig = IProjectConfigFilled | IProjectConfigUnfilled;

export type IUserConfigFilled = {
  kind: "user";
  /** indicates whether the user config file exists */
  userConfig: true;
} & ICommandConfig &
  IGeneralConfig;

export type IUserConfigUnfilled = {
  kind: "user";
  userConfig: false;
} & NotDefined<ICommandConfig> &
  NotDefined<IGeneralConfig>;
export type IUserConfig = IUserConfigFilled | IUserConfigUnfilled;

export type IIntegratedConfig = { kind: "integrated"; ready: boolean } & Omit<
  IUserConfig,
  "kind"
> &
  Omit<IProjectConfig, "kind">;

export type IDoConfig = IUserConfigFilled | IProjectConfigFilled | IIntegratedConfig;

export function configIsReady(config: unknown): config is IDoConfig {
  return (
    (typeof config === "object" &&
      config !== null &&
      (config as IDictionary).kind === "integrated" &&
      (config as IDictionary).ready) ||
    ((config as IDoConfig).kind === "project" &&
      (config as IProjectConfigFilled).projectConfig === true) ||
    ((config as IDoConfig).kind === "user" &&
      (config as IUserConfigFilled).userConfig === true)
  );
}
