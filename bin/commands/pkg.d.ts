import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
export declare function description(opts: IDictionary): Promise<string>;
export declare const options: OptionDefinition[];
export declare const syntax = "do package <options>";
/**
 * **Package Handler**
 *
 * The `package` command is used in **Serverless** projects to build all of
 * the _deployable_ assets but without actually deploying.
 */
export declare function handler(argv: string[], opts: any): Promise<void>;
