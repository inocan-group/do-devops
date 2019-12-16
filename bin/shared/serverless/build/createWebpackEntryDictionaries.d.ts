import { IDictionary } from "common-types";
/**
 * Webpack can create named multiple entry points if the `entry` parameter
 * is passed a dictionary where the key is the module name (in Serverless
 * this would be the handler's name) and the value is then the full path to
 * the file.
 *
 * This function will, given a path to the source typescript files, produce
 * two dictionaries:
 *
 * 1. `webpack.ts-entry-points.json` - a dictionary that points to the handler's
 * typescript source
 * 2. `webpack.js-entry-points.json` - a dictionary that points to webpack's outputted
 * javascript files
 *
 * If you are using the `serverless-webpack` plugin you should use the former, if you
 * are managing the webpack process yourself then the latter is likely more appropriate.
 */
export declare function createWebpackEntryDictionaries(handlerFns: string[]): Promise<void>;
export declare function useKey(key: "jsPath" | "tsPath"): (agg: IDictionary<string>, curr: {
    fn: string;
    tsPath: string;
    jsPath: string;
}) => IDictionary<string>;
