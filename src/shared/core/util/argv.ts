import { OptionDefinition } from "command-line-usage";
import { Command } from "src/@types/command";
import { OptionDefn } from "src/@types/option-types";

/**
 * Determines if a given command has an `argv` parameter
 */
export function hasArgv(cmd: Command<any>) {
  return !Object.keys(cmd?.options || {}).every(
    (k) => !(cmd?.options as OptionDefn)[k]?.defaultOption
  );
}

/**
 * Gives back the default option configuration which will
 * be made available as `argv` to a command.
 *
 * Returns `undefined` if there is no default option.
 */
export function getArgvOption(cmd: Command<any>) {
  const o = cmd?.options || {};
  return Object.keys(o).reduce((acc, key) => {
    if (o[key].defaultOption) {
      return { ...o[key], name: key };
    }

    return acc;
  }, undefined as undefined | OptionDefinition);
}
