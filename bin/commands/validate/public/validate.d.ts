import { IDictionary } from "common-types";
export declare type ValidationAction = "none" | "warn" | "error";
export interface IValidationHandler {
    handler: (action: ValidationAction, currentBranch: string, options?: IDictionary) => Promise<0 | 1>;
}
/**
 * Validate a set of known sub-commands and return
 */
export declare function handler(argv: string[], opts: IDictionary): Promise<void>;
