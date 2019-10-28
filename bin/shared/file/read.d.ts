export interface IWriteOptions {
    spacing?: number;
    /**
     * if set to `true` it will add a numeric offset to the filename to avoid collisions
     */
    offsetIfExists?: boolean;
}
/**
 * **read**
 *
 * Reads a file to the filesystem; default to files which are based off the repo's
 * root
 *
 * @param filename the filename to be read; if filename doesn't start with either a '/' then it will be joined with the project's current working directory
 */
export declare function read(filename: string, options?: IWriteOptions): Promise<{
    filename: string;
    data: any;
}>;
