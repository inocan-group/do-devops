import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
import { ICommandDescription } from "../@types/index";
/**
 * Description of command for help text
 */
export declare function description(...opts: any[]): string;
export declare const syntax = "do ssm <sub-command> <options>";
export declare const commands: ICommandDescription[];
export declare const examples: string[];
export declare const options: OptionDefinition[];
export declare function handler(argv: string[], ssmOptions: IDictionary): Promise<void>;
