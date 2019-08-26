import { IDictionary, IServerlessFunction } from "common-types";

export interface IDoHandler {
  handler(argv: string[], options?: IDictionary): void;
}

export interface IServerlessAccountInfo {
  name?: string;
  accountId?: string;
  region?: string;
  profile?: string;
}

export type ISandboxStrategy = "dev" | "user" | "branch";

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
export type IFunctionConfig = Omit<IServerlessFunction, "handler">;
