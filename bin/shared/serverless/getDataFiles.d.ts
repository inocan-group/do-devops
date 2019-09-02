export interface IDataFileOptions {
    /** allows filtering by a particular file type (aka, file extension) */
    fileType?: string;
    /** optionally filter results to those which contain a given string */
    filterBy?: string;
    /** optionally strip off the file extentions from the list */
    stripFileExtension?: boolean;
}
/**
 * Gets a list of data files from the
 * `test/data` directory.
 */
export declare function getDataFiles(opts?: IDataFileOptions): Promise<string[]>;
