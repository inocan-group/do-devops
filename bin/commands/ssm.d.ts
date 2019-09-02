import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
/**
 * Description of command for help text
 */
export declare function description(): string;
export declare const options: OptionDefinition[];
export declare function handler(argv: string[], ssmOptions: IDictionary): Promise<void>;
