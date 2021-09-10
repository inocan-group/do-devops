import { readFile } from "./readFile";
import parse from "destr";

/**
 * Reads in a file and then parses it into a JS data structure.
 * 
 * Note: if the file is not found then this function will return
 * _undefined_
 */
export function readAndParseFile<T>(filename: string): T | undefined {
  const data = readFile(filename);
  return data !== undefined ? parse(data) as T : undefined;
}