import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
/**
 * A list of all options from all commands (including global options)
 */
export declare function globalAndLocalOptions(optsSet: IDictionary, fn: string): Promise<OptionDefinition[]>;
export declare const globalOptions: OptionDefinition[];
