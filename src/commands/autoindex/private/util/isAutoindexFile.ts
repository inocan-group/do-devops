import chalk from "chalk";
import { readFileSync, writeFileSync } from "node:fs";
import { logger } from "src/shared/core/logger";
import { emoji } from "src/shared/ui";
import { NEW_AUTOINDEX_CONTENT } from "../reference";

/**
 * Looks at _candidate_ index files and determines -- based on content --
 * whether this file is indeed an autoindex file. Conditions:
 *
 * - completely empty `index.[t|j]s` file
 * - file with modern or old "autoindex signature"
 */
export function isAutoindexFile(filename: string) {
  const log = logger();
  const file = readFileSync(filename, "utf8");
  const isEmpty = file.trim() === "";
  const hasSignature = /\/\/\s*#autoindex/.test(file);
  if (isEmpty) {
    log.shout(`- ${emoji.shocked} the index file ${chalk.blue`${filename}} was EMPTY!`}`);
    writeFileSync(filename, NEW_AUTOINDEX_CONTENT);
    log.shout(`- ${emoji.robot} made this file into an ${chalk.italic`autoindex`} file\n`);
    return true;
  }
  return isEmpty || hasSignature;
}

/**
 * Tests whether the content passed in is a NEW autoindex file
 */
export function isNewAutoindexFile(content: string) {
  return /\/\/\s+#autoindex/s.test(content) && !/\/\/ index last changed/s.test(content);
}
