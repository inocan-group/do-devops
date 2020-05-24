import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare function description(): string;
export declare const options: OptionDefinition[];
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export declare function handler(argv: string[], opts: IDictionary): Promise<void>;
export declare function communicateApi(paths: string[]): void;
