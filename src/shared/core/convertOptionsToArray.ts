import { OptionDefinition } from "command-line-usage";
import { OptionDefn } from "src/@types/option-types";

/**
 * Takes a dictionary of CLI options and coverts it to an array of options
 * for use in the `command-line-args` package.
 */
export function convertOptionsToArray(input: OptionDefn): OptionDefinition[] {
  return Object.keys(input).map((key) => {
    return { name: key, ...input[key] };
  });
}
