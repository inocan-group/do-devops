import * as commands from "../commands/index";
import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";

export type ICommandDeferment<T> = (opts: IDictionary) => Promise<T>;

export interface ICommandInterface {
  handler: (argv: string[], opts: IDictionary) => Promise<void>;
  options?: ICommandDeferment<OptionDefinition[]> | OptionDefinition[];
  description?: ICommandDeferment<string> | string;
  syntax?: ICommandDeferment<string> | string;
}

export function getCommandInterface(cmd: string) {
  const cmdDefn: ICommandInterface = commands[
    cmd as keyof typeof commands
  ] as ICommandInterface;

  return cmdDefn;
}
