import { IHandlerReference } from "../../../@types/index";
/**
 * Writes to the `serverless-config/functions/inline.ts` file
 * all of the handler functions which were found off the "handlers"
 * directory.
 *
 * The configuration will only include the reference to the `handler`
 * file unless the function exports a `config` property to express
 * other configuration properties.
 */
export declare function writeInlineFunctions(handlers: IHandlerReference[], functionRoot?: string, fileName?: string): Promise<void>;
