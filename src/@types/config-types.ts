import {
  AwsAccountId,
  AwsArnPartition,
  AwsRegion,
  AwsStage,
  IDictionary,
  IServerlessFunctionHandler,
} from "common-types";
import { NotDefined } from "./general";
import { IImagePreBlurConfig, IImageRule } from "./images";
import { BundlerObservation, PackageManagerObservation, TestObservation } from "./observations";

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

    /**
     * which bundler does a given repro prefer?
     */
    bundler?: BundlerObservation;

    testDir?: string;
    srcDir?: string;

    /**
     * Allows a user to store what command to use for bringing up files in
     * an editor.
     */
    editorCommand?: string;
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
    stepFns?: string[];
  };
  deploy?: {};
  endpoints?: {};
  fns?: {};
  image?: {
    /**
     * The directory to look for source images
     */
    sourceDir: string;
    /**
     * The (base) directory to place images when generated
     */
    targetDir: string;
    /** 
     * the _breakpoints_ which the app uses can be defined; each breakpoint
     * should be given a name and then the number represents the min-width to achieve this.
     * 
     * By default this is set as:
     * ```ts
     * {
     *  sm: 640,
     *  md: 768,
     *  lg: 1024,
     *  xl: 1280,
     *  xxl: 1536
     * }
     * ```
     */
    breakpoints?: Record<string, number>;
    /**
     * Expresses whether a small 
     */
    preBlur?: IImagePreBlurConfig;
    quality?: {
      jpg?: number;
      webp?: number;
      avif?: number;
    };
    rules?: IImageRule[];
  };
  info?: {};
  invoke?: {};
  latest?: {};
  layers?: {};
  pkg?: {};
  ssm?: {};
  test?: {
    unitTestFramework?: TestObservation;
    useWallaby?: boolean;
    /** the directory where test files are located; typically "test", "tests" or possibly "src" */
    testDirectory?: string;
    /** the filename's ending pattern before which identifies a test file withing a directory structure*/
    testFilePostfix?: string[];
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
