import { readFileSync } from "fs";

export function isAutoindexFile(filename: string) {
  return readFileSync(filename, "utf-8").includes("//#autoindex");
}
