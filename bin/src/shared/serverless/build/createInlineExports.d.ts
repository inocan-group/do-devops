import { IServerlessFunction } from "common-types";
import { IHandlerInfo } from "../getLocalHandlerInfo";
export interface IInlineExportConfig {
    interface: string;
    config: IServerlessFunction;
}
/**
 * Writes the serverless configuration file which contains
 * all the _inline_ function definitions found under `src/handlers`.
 *
 * **Note:** if the build tool is _webpack_ and the `serverless-webpack`
 * plugin is _not_ installed then it the inline functions will instead
 * be pointed to the transpiled location in the `.webpack` directory with
 * an `package: { artifact: fn.zip }`
 */
export declare function createInlineExports(handlers: IHandlerInfo[]): Promise<void>;
