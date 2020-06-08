import * as commands from "../commands/index";

import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";

export type ICommandDeferment<T> = (opts: IDictionary) => Promise<T>;

export interface ICommandInterface {
  handler: (argv: string[], opts: IDictionary) => Promise<void>;
  description: ICommandDeferment<string> | string;
  options?: ICommandDeferment<OptionDefinition[]> | OptionDefinition[];
  syntax?: ICommandDeferment<string> | string;
  excludeOptions?: ICommandDeferment<string> | string[];
}

export function getCommandInterface(cmd: string) {
  const cmdDefn: ICommandInterface = commands[cmd as keyof typeof commands] as ICommandInterface;
  if (!cmdDefn.handler) {
    throw new Error(`The command "${cmd}" is not known`);
  }
  if (!cmdDefn.description) {
    console.warn(
      `The command "${cmd}" has been defined but does NOT have a description which is a informal part of the contract!`
    );
  }

  return cmdDefn;
}
