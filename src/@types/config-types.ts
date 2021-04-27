import { AwsRegion } from "common-types";
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

export type IProjectConfigUnfilled = { kind: "project"; projectConfig: false };

export type IProjectConfig = IProjectConfigFilled | IProjectConfigUnfilled;

export type IUserConfigFilled = {
  kind: "user";
  /** indicates whether the user config file exists */
  userConfig: true;
} & ICommandConfig &
  IGeneralConfig;

export type IUserConfigUnfilled = { kind: "user"; userConfig: false };

export type IIntegratedConfig = {
  kind: "integrated";
  userConfig: boolean;
  projectConfig: boolean;
} & ICommandConfig &
  IGeneralConfig;

export type IUserConfig = IUserConfigFilled | IUserConfigUnfilled;

export type IDoConfig = IUserConfigFilled | IProjectConfigFilled | IIntegratedConfig;
