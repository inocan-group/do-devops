import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { logger } from "~/shared/core/logger";
import { emoji } from "~/shared/ui";
import { NEW_AUTOINDEX_CONTENT } from "../reference";

/**
 * Looks at _candidate_ index files and determines -- based on content --
 * whether this file is indeed an autoindex file. Also turns it into an autoindex file
 * if it's completely empty.
 */
export function isAutoindexFile(filename: string) {
  const log = logger();
  const file = readFileSync(filename, "utf-8");
  if (file.replace(/\s+/g, "") === "") {
    log.shout(chalk`- ${emoji.shocked} the index file {blue ${filename}} was EMPTY!`);
    writeFileSync(filename, NEW_AUTOINDEX_CONTENT);
    log.shout(chalk`- ${emoji.robot} made this file into an {italic autoindex} file\n`);
    return true;
  }
  return /\/\/\s*#autoindex/.test(file);
}

/**
 * Tests whether the content passed in is a NEW autoindex file
 */
export function isNewAutoindexFile(content: string) {
  return /\/\/\s+#autoindex/s.test(content) && !/\/\/ index last changed/s.test(content);
}
