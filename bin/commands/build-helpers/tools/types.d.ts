import { IDictionary } from "common-types";
export interface IBuildToolingOptions {
    /** a list of functions to build; if left off then all functions will be built */
    fns?: string[];
    opts?: IDictionary;
}
