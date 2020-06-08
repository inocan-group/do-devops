import { IDictionary } from "common-types";
export interface IFunctionDictionary {
    /** full path to the handler files */
    filePath: string;
    /** the full path to the directory which has the handler and function files */
    fileDir: string;
    /** relative path to the handler and function files */
    relativePath: string;
    /** whether or not file is a valid serverless handler definition */
    validHandlerDefinition: boolean;
    /** the filename of the handler configuration */
    configFilename: string;
    /** the filename of the actual serverless function */
    fnFilename: string;
    /** serverless registered name */
    serverlessFn: string;
}
export declare function createFunctionDictionary(rootPath?: string): Promise<IFunctionDictionary[]>;
/**
 * **writeServerlessFunctionExports**
 *
 * writes all serverless function definition/configurations to the
 * `serverless-config/functions.ts` file. This file will not only
 * export all function definitions but will also provide a typescript
 * **type** called `IDefinedServerlessFunction` which will be a set of
 * string names which are defined in the given repo
 *
 * @param basePath you may alternatively state a base file path to use
 * when looking for function definition files (aka, files named `*.defn.ts`)
 * @param output rather than exporting to the file `serverless-config/functions.ts` you
 * may state an alternative
 */
export declare function writeServerlessFunctionExports(basePath?: string, output?: string): Promise<void>;
/**
 * **reduceToRelativePath**
 *
 * Reduces the file path to just the relative path _beyond_ the passed in `root` path
 */
export declare function reduceToRelativePath(root: string, fullyQualifiedPath: string): string;
/**
 * **getFilePath**
 *
 * given a filepath, this function strips off the filename and returns just
 * the path which the file resides in.
 */
export declare function getFilePath(filePath: string): string;
/**
 * **getFilenameWithoutExtension**
 *
 * Given a path, filename, and extension (including `.def.ts` as an extension type);
 * this function will return just the filename component.
 */
export declare function getFilenameWithoutExtension(filePath: string): string;
/**
 * **validateExports**
 *
 * Given an array of file imports, returns a hash of `valid` and `invalid`
 * files based on whether they represent a valid Lambda Serverless handler
 * definition.
 */
export declare function validateExports(fnDefns: string[]): Promise<{
    valid: string[];
    invalid: string[];
}>;
/**
 * **getNamespacedFilename**
 *
 * Directories off of the "root/base" should be considered a "namespace" so that
 * function names do not collide as well as to ensure that a functions "context"
 * if fully captured by the name. For this reason a handler function named
 * `netlify/deployWebhook.ts` will be resolved to `service-name-[stage]-netlifyDeployWebhook`.
 *
 * This function is reponsible for providing a lookup hash who's keys are
 * the passed in
 */
export declare function getNamespacedLookup(fns: string[], basePath?: string): IDictionary<any>;
/**
 * **getFunctionNames**
 *
 * Given a set of paths to function definition files, will return a
 * lookup hash which provides the "function name" as the output
 */
export declare function getFunctionNames(paths: string[]): IDictionary<string>;
export declare function detectDuplicateFunctionDefinitions(lookup: IDictionary<string>): {
    fn: string;
    message: string;
    locations: string[];
}[];
export declare function functionList(): void;
