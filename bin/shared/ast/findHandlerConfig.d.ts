import { IServerlessFunction } from "common-types";
/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export. It will also provide a
 * list of functions who's `config` export did _not_ expressly
 * type the config as `IWrapperFunction`
 */
export declare function findHandlerConfig(filename: string, 
/** the _package_ section should be replaced with a reference to the `filename.zip` */
isWebpackZip?: boolean): {
    interface: string;
    config: IServerlessFunction;
};
