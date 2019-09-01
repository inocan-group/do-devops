import { IDictionary, IServerlessFunction } from "common-types";
export interface IDoHandler {
    handler(argv: string[], options?: IDictionary): void;
}
export declare type arn = string;
export interface IServerlessAccountInfo {
    name?: string;
    accountId?: string;
    region?: string;
    profile?: string;
    /**
     * if you want to forward logs to another lambda you can state the **ARN** here
     */
    logForwarding?: arn;
    /**
     * a list of serverless plugins installed
     */
    pluginsInstalled: string[];
}
export declare type ISandboxStrategy = "dev" | "user" | "branch";
export interface ICommandDescription {
    name: string;
    summary: string;
}
export interface IHelpConfig {
    /** the syntax to invoke a command */
    syntax: string;
    /** you can add a text that goes below the syntax that provides additional context */
    syntaxDescription?: string;
    /** the sub-commands which this command allows for */
    subCommands: ICommandDescription[];
}
/**
 * Intended to type the _inline_ configuration of a function when using
 * the build system in **do-devops**. This is nothing more than a the `IServerlessFunction`
 * but _ommitting_ the `handler` property because that property -- which is required --
 * is managed automatically for you by the build process.
 */
export declare type IFunctionConfig = Omit<IServerlessFunction, "handler">;
/**
 * Options to be be passed into `determineStage`, `determineXXX`
 * methods.
 */
export interface IDetermineOptions {
    /** if no profile could be find, drop into interactive mode */
    interactive?: boolean;
    /** the CLI options */
    cliOptions?: IDictionary;
}
