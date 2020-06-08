import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare const defaultConfig: {
    preBuildHooks: string[];
    targetDirectory: string;
    buildTool: string;
};
export declare const options: OptionDefinition[];
export declare function description(): string;
export declare function handler(argv: string[], opts: IDictionary): Promise<void>;
