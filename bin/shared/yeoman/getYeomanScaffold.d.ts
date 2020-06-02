/**
 * Get's the name(s) of the scaffolding repo(s) used for the given project. The return
 * is always an array of strings; if no scaffold is found then the array will be empty.
 *
 * Note: it is _possible_ that there is more than one but this would be considered
 * highly unusual.
 */
export declare function getYeomanScaffolds(): string[];
