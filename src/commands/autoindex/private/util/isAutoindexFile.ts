import { readFileSync } from "fs";

export function isAutoindexFile(filename: string) {
  return /^\/\/\s*#autoindex/.test(readFileSync(filename, "utf-8"));
}
