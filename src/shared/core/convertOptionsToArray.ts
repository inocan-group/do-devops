import { OptionDefinition } from "command-line-usage";
import { IOptionDefinition } from "src/@types/option-types";

/**
 * Takes a dictionary of CLI options and coverts it to an array of options
 * for use in the `command-line-args` package.
 */
export function convertOptionsToArray(input: IOptionDefinition): OptionDefinition[] {
  return Object.keys(input).map((key) => {
    return { name: key, ...input[key] };
  });
}
