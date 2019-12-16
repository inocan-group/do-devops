import { IHandlerInfo } from "../getLocalHandlerInfo";
/**
 * creates an enumeration with all of the _functions_ which have
 * been defined in the project
 */
export declare function createFunctionEnum(handlers: IHandlerInfo[]): Promise<string>;
