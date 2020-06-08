export declare const description = "Summarized information about the current repo";
export declare const options: {
    name: string;
    alias: string;
    type: StringConstructor;
    group: string;
    description: string;
    typeLabel: string;
}[];
/**
 * Gets the `git` and `npm` version of a file as well as
 * whether the local copy is dirty.
 */
export declare function handler(argv: string[], opts: any): Promise<void>;
