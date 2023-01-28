import { globalOptions } from "src/shared/core";
import { DoDevopObservation } from "./observations";

export type IDoDevopsGlobalOptions = typeof globalOptions;

/**
 * Option values derives from the global options
 */
export type GlobalOptions = {
  quiet?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  help?: boolean;
};

export interface CommandParsing {
  observations: Set<DoDevopObservation>;
  subCommand?: string | undefined;
  argv: string[];
  raw: string[];
  opts: GlobalOptions;
  unknown: string[];
}
