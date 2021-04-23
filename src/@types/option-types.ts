import { OptionDefinition } from "command-line-usage";

/**
 * A constrained set of "group names" to keep our groups to mainly just
 * global and local options but with `l2` available for commands which
 * have sub-commands (aka, like `ssm`)
 *
 * > The `args` group name is to peel off the argv parameters going to
 * > a local command.
 */
export type IDoDevopsOptionGroup = "global" | "local" | "l2" | "args";

export type OptionDefinitionHash = Omit<OptionDefinition, "name" | "group"> & {
  group: IDoDevopsOptionGroup;
};

/**
 * A dictionary of CLI options where the _key_ represents the _name_ of the Option.
 *
 * **Note:** _this structure is more convenient in most cases -- to the array which_
 * `command-line-usage` _will need in the end -- as it allows us to merge
 * definitions (like global and local)_
 */
export type IOptionDefinition<T extends string = string> = {
  [option in T]: OptionDefinitionHash;
};
