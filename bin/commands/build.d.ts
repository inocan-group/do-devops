import { IDictionary } from "common-types";
export declare const defaultConfig: {
    preBuildHooks: string[];
    targetDirectory: string;
    buildTool: string;
};
export declare function description(): string;
export declare function handler(opts: IDictionary): Promise<void>;
