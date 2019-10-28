import { IDictionary } from "common-types";
export interface IWriteOptions {
    spacing?: number;
    /**
     * if set to `true` it will add a numeric offset to the filename to avoid collisions
     */
    offsetIfExists?: boolean;
}
/**
 * **write**
 *
 * Writes a file to the filesystem; favoring files which are based off the repo's
 * root
 *
 * @param filename the filename to be written; if filename doesn't start with either a '.' or '/' then it will be joined with the projects current working directory
 * @param data the data to be written
 */
export declare function write(filename: string, data: string | IDictionary, options?: IWriteOptions): Promise<{
    filename: string;
    data: string;
}>;
