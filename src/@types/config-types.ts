import {
  AwsAccountId,
  AwsArnPartition,
  AwsRegion,
  AwsStage,
  IDictionary,
  IServerlessFunctionHandler,
} from "common-types";
import { NotDefined } from "./general";
import { PackageManagerObservation, TestObservation } from "./observations";

export interface IGlobalConfig {
  /**
   * General/shared configuraiton across commands
   */
  general: {
    /**
     * the default package manager to use if other means aren't
     * available to determine.
     */
    pkgManager?: PackageManagerObservation;
  };
  aws: {
    /**
     * A default AWS _region_ to use for if other means fail to identify
     * the region.
     */
    defaultRegion?: AwsRegion;

    /**
     * A default _profile_ to use for AWS if other means fail to identify
     * the profile name.
     */
    defaultProfile?: string;

    /**
     * The default stage for Serverless build/deploy operations
     */
    defaultStage?: AwsStage;

    /**
     * The default AWS _partition_
     */
    defaultPartition?: AwsArnPartition;

    /**
     * The _default_ account id to use for AWS
     */
    defaultAccountId?: AwsAccountId;

    /**
     * The default AWS stack/app name
     */
    defaultStackName?: string;
  };
}

export interface ICommandConfig {
  autoindex?: {
    /** the glob pattern to identify files to autoindex */
    glob?: string;
    /** include the VueJS SFC files and export the default export to a named export in index file */
    sfc?: boolean;
    /** specific files to add to regex pattern */
    addedFiles?: string[];
  };
  awsid?: {};
  build?: {
    lambda?: IServerlessFunctionHandler[];
  };
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
    useWallaby: boolean;
    testPattern: string;
  };
}

export type IProjectConfigFilled = {
  kind: "project";
  /** indicates whether the project config file exists */
  projectConfig: true;
} & ICommandConfig &
  IGlobalConfig;

export type IProjectConfigUnfilled = {
  kind: "project";
  projectConfig: false;
} & NotDefined<ICommandConfig> &
  NotDefined<IGlobalConfig>;

export type IProjectConfig = IProjectConfigFilled | IProjectConfigUnfilled;

export type IUserConfigFilled = {
  kind: "user";
  /** indicates whether the user config file exists */
  userConfig: true;
} & ICommandConfig &
  IGlobalConfig;

export type IUserConfigUnfilled = {
  kind: "user";
  userConfig: false;
} & NotDefined<ICommandConfig> &
  NotDefined<IGlobalConfig>;
export type IUserConfig = IUserConfigFilled | IUserConfigUnfilled;

export type IIntegratedConfig = { kind: "integrated"; ready: boolean } & Omit<IUserConfig, "kind"> &
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
    ((config as IDoConfig).kind === "user" && (config as IUserConfigFilled).userConfig === true)
  );
}
