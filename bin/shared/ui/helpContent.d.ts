import { ICommandDescription } from "../../@types";
import { IDictionary } from "common-types";
export declare function getHelpCommands(fn?: string): Promise<ICommandDescription[]>;
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
/**
 *
 * @param opts
 * @param fn
 */
export declare function getExamples(opts: IDictionary, fn?: string): Promise<any>;
export declare function getOptions(opts: IDictionary, fn?: string): Promise<import("command-line-usage").OptionDefinition[]>;
