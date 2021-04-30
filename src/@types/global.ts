import { globalOptions } from "~/shared/core";

export type IDoDevopsGlobalOptions = typeof globalOptions;

/**
 * Option values derives from the global options
 */
export interface IGlobalOptions {
  quiet?: boolean;
  verbose?: boolean;
  help?: boolean;
}
