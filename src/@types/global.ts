import { globalOptions } from "~/shared/core";

export type IDoDevopsGlobalOptions = typeof globalOptions;

/**
 * Option values derives from the global options
 */
export type IGlobalOptions<T extends object = {}> = {
  quiet?: boolean;
  verbose?: boolean;
  help?: boolean;
} & Partial<T>;
