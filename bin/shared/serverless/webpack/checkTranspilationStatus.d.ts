/**
 * **checkTranspilationStatus**
 *
 * Functionally identifies whether a given handler function needs
 * to be transpiled based on:
 *
 * 1. Compares the transpiled handler functions with the source files.
 * 2. The most recent timestamp of all `.ts` source files
 *
 * @param fns the list of functions you are considering transpiling
 */
export declare function checkTranspilationStatus(fns: string[]): Promise<void>;
