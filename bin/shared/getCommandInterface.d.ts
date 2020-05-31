import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare type ICommandDeferment<T> = (opts: IDictionary) => Promise<T>;
export interface ICommandInterface {
    handler: (argv: string[], opts: IDictionary) => Promise<void>;
    description: ICommandDeferment<string> | string;
    options?: ICommandDeferment<OptionDefinition[]> | OptionDefinition[];
    syntax?: ICommandDeferment<string> | string;
    excludeOptions?: ICommandDeferment<string> | string[];
}
export declare function getCommandInterface(cmd: string): ICommandInterface;
