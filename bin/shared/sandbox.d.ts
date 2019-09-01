import { ISandboxStrategy } from "../@types";
/**
 * Determines the `stage` to replace "dev" with a more
 * isolated sandboxing strategy; based on the user's
 * sandbox configuration
 */
export declare function sandbox(strategy: ISandboxStrategy): Promise<string>;
