import { INpmInfo } from "common-types";
/**
 * Calls on the network to get `yarn info [xxx]`;
 * if the package name is excluded then it just
 * looks for the local package and throws an error
 * if not found
 */
export declare function getPackageInfo(pkg?: string): Promise<INpmInfo>;
