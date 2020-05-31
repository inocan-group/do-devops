import { IPackageJson } from "common-types";
export declare function getLocalPackageJson(): false | IPackageJson;
export declare function saveLocalPackageJson(pkgJson: IPackageJson): void;
export declare function getRemotePackageJson(repo: string): false | IPackageJson;
export declare function saveRemotePackageJson(repo: string, pkgJson: IPackageJson): void;
