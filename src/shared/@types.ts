import { IDictionary } from "common-types";

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
