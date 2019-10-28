export interface IHandlerInfo {
    /** the function name (no _path_ or _file extension_) */
    fn: string;
    /**
     * the fully qualified _path_ and _filename_ to the source file
     */
    source: string;
    /**
     * date/time the source file was last modified
     */
    sourceModified: Date;
    /**
     * the fully qualified _path_ and _filename_ to the **webpack** transpiled file;
     * blank if this doesn't exist
     */
    webpack: string;
    /**
     * the date/time the transpiled file was last modified
     */
    webpackModified: Date;
}
/**
 * Based on the inline serverless functions, it gets the following:
 *
 * 1. `fn` - the function name _without_ file path or extension
 * 2. `source` - path -- including filename -- of the source file
 * 3. `sourceModified` - the date the source was last modified
 * 4. `webpack` - the path and filename to the transpiled webpack code
 * 5. `webpackModified` - the date the webpack transpiled code was last modified
 *
 * **Note:** this function _caches_ results for better performance but you
 * can break the cache by send in a `true` value to the `breakCache` parameter.
 */
export declare function getLocalHandlerInfo(breakCache?: boolean): IHandlerInfo[];
