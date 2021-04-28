import { IOptionDefinition } from "~/@types/option-types";

export const globalOptions: IOptionDefinition = {
  quiet: {
    alias: "q",
    type: Boolean,
    group: "global",
    description: "stops all output to {italic stdout}",
  },
  verbose: {
    alias: "v",
    type: Boolean,
    group: "global",
    description: "makes the output more verbose",
  },
  help: {
    alias: "h",
    type: Boolean,
    group: "global",
    description: "shows help for given command",
  },
};

export type IDoDevopsGlobalOptions = typeof globalOptions;

/**
 * Option values derives from the global options
 */
export interface IGlobalOptions {
  quiet?: boolean;
  verbose?: boolean;
  help?: boolean;
}
