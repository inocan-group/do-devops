import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare function description(): string;
export declare function examples(): string[];
export declare const options: OptionDefinition[];
export declare function handler(args: string[], opt: IDictionary): Promise<void>;
