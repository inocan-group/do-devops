import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
export declare function description(opts: IDictionary): Promise<string>;
export declare const syntax = "do package <options>";
export declare function options(opts: IDictionary): Promise<OptionDefinition[]>;
/**
 * **Package Handler**
 *
 * The `package` command is used in **Serverless** projects to build all of
 * the _deployable_ assets but without actually deploying.
 */
export declare function handler(argv: string[], opts: any): Promise<void>;
