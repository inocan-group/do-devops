/**
 * Gives back a list of packages in the monorepo. If the
 * "packages" directory does not exist then it will return
 * `false`, if there _is_ a packages directory but no sub-directories
 * you'll just get an empty array.
 */
export declare function getMonoRepoPackages(baseDir: string): false | string[];
