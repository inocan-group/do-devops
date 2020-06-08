import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare function description(): string;
export declare const options: OptionDefinition[];
export declare function handler(args: string[], opts: IDictionary): Promise<void>;
