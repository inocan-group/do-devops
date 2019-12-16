/// <reference types="node" />
import { Stats } from "fs";
export declare function directoryFiles(dir: string): {
    file: string;
    stats: Stats;
}[];
