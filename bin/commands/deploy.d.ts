import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare const defaultConfig: {
    preDeployHooks: string[];
    target: string;
    showUnderlyingCommands: boolean;
    sandboxing: string;
};
export declare function description(opts: IDictionary): Promise<string>;
export declare const syntax = "do deploy [fn1] [fn2] <options>\n\n{dim Note: {italic stating particular functions is {italic optional} and if excluded will result in a full deployment of all functions.}}";
export declare function options(opts: IDictionary): Promise<OptionDefinition[]>;
/**
 * **Deploy Handler**
 *
 * The _deploy_ command is used when you want to push your changes
 * to an environment where they will be used. This can mean different
 * things based on context and this handler will support the following
 * deployment scenarios:
 *
 * 1. Deploy to `npm` (aka, publish)
 * 2. Deploy to a serverless environment by leveraging the **Serverless** framework
 *
 * Over time we may add other targets for deployment.
 */
export declare function handler(argv: string[], opts: any): Promise<void>;
