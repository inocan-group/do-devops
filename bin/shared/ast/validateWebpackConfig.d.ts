/**
 * Validates that the webpack config:
 *
 * 1. has a `modules.exports` declaration
 * 2. is a functional representation and the function takes a `fns` parameter
 * 3. warns to CLI if there is no `options` parameter
 *
 * @param filename optionally override the default webpack config filename
 */
export declare function validateWebpackConfig(filename?: string): void;
