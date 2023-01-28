import { globalOptions } from "src/shared/core";
import { DoDevopObservation } from "./observations";

export type IDoDevopsGlobalOptions = typeof globalOptions;

/**
 * Option values derives from the global options
 */
export type Options<T extends object = {}> = {
  quiet?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  help?: boolean;
} & Partial<T>;

export interface CommandParsing {
  observations: Set<DoDevopObservation>;
  subCommand?: string | undefined;
  argv: string[];
  raw: string[];
  opts: Options<Record<string, unknown>>;
  unknown: string[];
}
