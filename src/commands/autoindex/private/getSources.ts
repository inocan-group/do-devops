import { CommandRuntimeOption, Observations } from "src/@types";
import { ILogger } from "src/shared/core";
import { AutoindexSource } from "./reference/types";

/**
 * **getSources**(argv,opts,obs,log)
 * 
 * Using CLI flags and current directory context, this function's
 * primary responsibility is to determine the list of valid sources
 * and then complete the `AutocompleteSource` type structure for each.
 */
export const getSources = (
  argv: string[], 
  opts: CommandRuntimeOption<"autoindex">, 
  obs: Observations, 
  log: ILogger
): AutoindexSource[] => {
  const strategy = opts.explicitFiles
    ? "explicit-files"
    : obs.has("monorepo")
    ? "monorepo"
    : "repo";

  switch(strategy) {
    case "explicit-files":
      
  }

};
