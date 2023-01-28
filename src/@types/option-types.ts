import { OptionDefinition as CliOption } from "command-line-usage";
import { AfterFirst, AnyFunction, ExpandRecursively, First,  Keys,  Narrowable, UnionToTuple } from "inferred-types";
import { GlobalOptions } from "./global";

/**
 * A constrained set of "group names" to keep our groups to mainly just
 * global and local options but with `l2` available for commands which
 * have sub-commands (aka, like `ssm`)
 *
 * > The `args` group name is to peel off the argv parameters going to
 * > a local command.
 */
export type IDoDevopsOptionGroup = "global" | "local" | "l2" | "subCommand" | "argv";

export type OptionDefinitionHash = Omit<
CliOption, "name" | "group" | "type"
> & {
  type: StringConstructor | NumberConstructor | BooleanConstructor | Function;
};

/**
 * **OptionDefn**
 * 
 * A dictionary of CLI options where the _key_ is the _name_ of the CLI 
 * option and the _value_ is the definition of it in a form that it can 
 * be used by `command-line-usage`.
 * 
 * **Related:** `CliOption`
 */
export type OptionDefn<T extends Narrowable> = T & Record<string,OptionDefinitionHash>;

type FCD<
  TObj extends OptionDefn<any>,
  TKeys extends readonly (string & keyof TObj)[],
  TResults extends Record<string, any> = {}
> = [] extends TKeys
  ? ExpandRecursively<TResults & GlobalOptions>
  : FCD<
      TObj,
      AfterFirst<TKeys>,
      // append KV
      TResults & Record<
        First<TKeys>, 
        "type" extends keyof TObj[First<TKeys>]
          ? TObj[First<TKeys>]["type"] extends StringConstructor
            ? "defVal" extends keyof TObj[First<TKeys>] ? string : string | undefined
            : TObj[First<TKeys>]["type"] extends NumberConstructor
            ? "defVal" extends keyof TObj[First<TKeys>] ? number : number | undefined
            : TObj[First<TKeys>]["type"] extends BooleanConstructor
            ? "defVal" extends keyof TObj[First<TKeys>] ? boolean : boolean | undefined
            : TObj[First<TKeys>]["type"] extends AnyFunction
              ? "defVal" extends keyof TObj[First<TKeys>]
                ? ReturnType<TObj[First<TKeys>]["type"]>
                : ReturnType<TObj[First<TKeys>]["type"]> | undefined
              : never
        : never
      >
    >;

export type FromCommandDefn<
  TObj extends OptionDefn<any>,
  // TKeys extends readonly (string & keyof TObj)[]
> = FCD<
  TObj, 
  Readonly<UnionToTuple<Keys<TObj>>>
>;

