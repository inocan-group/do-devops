import { ISandboxStrategy } from "./general";
import { IDictionary } from "common-types";
import { IDoTestConfig } from "./test";
export interface IDoConfig {
    global: IDoGlobalConfig;
    deploy: IDoDeployConfig;
    build: IDoBuildConfig;
    test: IDoTestConfig;
    pkg: IDoPkgConfig;
}
export interface IDoPkgConfig {
    preDeployHooks?: string[];
    /**
     * In many/most cases we are wrapping commands provided by
     * different libraries. Should these underlying commands be
     * displayed as part of the CLI output?
     */
    showUnderlyingCommands: boolean;
}
export declare type IDoProjectType = 
/** a serverless project intended for a singular audience */
"serverless-project"
/** a serverless library meant to be consumed by multiple audiences */
 | "serverless-library"
/**
 * a library of typescript functions which are being exported to
 * be consumed by other JS/TS clients
 */
 | "library" | "vuejs-app";
export interface IDoGlobalConfig extends IDictionary {
    projectType: IDoProjectType;
    /**
     * optionally state a **AWS** _profile_ name to use
     * if there is no additional information to work
     * off of
     */
    defaultAwsProfile?: string;
    /**
     * optionally state an **AWS** _region_ to use
     * if there is no additional information to work off
     * of
     */
    defaultAwsRegion?: string;
}
export interface IDoBuildConfig {
    preBuildHooks?: string[];
    /**
     * Which tool are you using for running your build pipeline?
     */
    buildTool?: IBuildTool;
    /**
     * If you are using a _bespoke_ build tool then you set it here
     */
    bespokeCommand?: string;
}
export declare enum BuildTool {
    typescript = "typescript",
    webpack = "webpack",
    rollup = "rollup",
    bili = "bili",
    /** just runs `yarn run build` */
    yarn = "typescript",
    /** just runs `npm run build` */
    npm = "webpack",
    /**
     * some other build process that is not understood; this will throw an error
     * if a build is run.
     */
    other = "rollup",
    /**
     * There is **no** build step for this repo.
     *
     * Note: this is quite common with Serverless projects which just use the
     * build process to rebuild the `serverless.yml` file.
     */
    none = "bili"
}
export declare type IBuildTool = keyof typeof BuildTool;
export declare type IDoDeployConfig = IDoDeployServerless | IDoDeployNpm | IDoDeployBespoke | IDoDeployUnknown;
export interface IDoDeployConfigBase {
    preDeployHooks?: string[];
    /**
     * Which deployment target is your default
     */
    target: "serverless" | "npm" | "bespoke" | "unknown";
    /**
     * In many/most cases we are wrapping commands provided by
     * different libraries. Should these underlying commands be
     * displayed as part of the CLI output?
     */
    showUnderlyingCommands: boolean;
}
export interface IDoDeployUnknown extends IDoDeployConfigBase {
    target: "unknown";
}
export interface IDoDeployServerless extends IDoDeployConfigBase {
    stage?: "dev" | "test" | "stage" | "prod" | string;
    target: "serverless";
    /**
     * The sandboxing strategy for development deployments.
     *
     * - `dev` puts all dev deployments into the same sandbox
     * - `user` segments DEV deployments by the developers **git** username (if set)
     * - `branch` segments DEV deployments by the **git** feature branch that is being worked on
     */
    sandboxing: ISandboxStrategy;
}
export interface IDoDeployNpm extends IDoDeployConfigBase {
    target: "npm";
}
export interface IDoDeployBespoke extends IDoDeployConfigBase {
    target: "bespoke";
}
