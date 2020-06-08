import { IPackageJson } from "common-types";
/**
 * returns `package.json` of the local repo as a typed object
 */
export declare function getPackageJson(pathOverride?: string): IPackageJson;
