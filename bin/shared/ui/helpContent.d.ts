import { ICommandDescription } from "../@types";
import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
export declare function getCommands(fn?: string): Promise<ICommandDescription[]>;
/**
 * Gets the syntax for the help system for both "global help"
 * as well as on a per function basis. The syntax for a function
 * can be manually set by providing a `syntax` symbol on the
 * command. If not provided a default syntax will be used.
 */
export declare function getSyntax(fn?: string): Promise<string>;
/**
 * Gets the "description" content for the help area
 */
export declare function getDescription(opts: IDictionary, fn?: string): Promise<any>;
export declare function getOptions(opts: IDictionary, fn?: string): Promise<OptionDefinition[]>;
