/// <reference types="node" />
import { Stats } from "fs";
export interface IFileInfo {
    /** the file with the _path_ removed. */
    file: string;
    /** the file with the _path_ and _extension_ removed. */
    fileName: string;
    /** the file's _extension_ */
    extension: string;
    /** the _path_ of the file (without the file). */
    path: string;
    /** the fully qualified _path_, _file_, and _extension_. */
    filePath: string;
    /** the stats of the file (from **Node**'s fs.stat function). */
    stats: Stats;
}
/**
 * Runs **Node**'s `stat()` function across an array of functions
 *
 * @param files the list of files to **stat**. The files will automatically
 * be associated with the current working directory unless the filenames start
 * with a `/`.
 */
export declare function filesInfo(...files: string[]): IFileInfo[];
