import chalk from "chalk";
import { readFileSync, writeFileSync } from "fs";
import { logger } from "~/shared/core/logger";
import { emoji } from "~/shared/ui";

export function isAutoindexFile(filename: string) {
  const log = logger();
  const file = readFileSync(filename, "utf-8");
  if (file.replace(/\s+/g, "") === "") {
    log.shout(chalk`- ${emoji.shocked} the index file {blue ${filename}} was EMPTY!`);
    writeFileSync(filename, `// #autoindex`);
    log.shout(chalk`- ${emoji.robot} made this file into an {italic autoindex} file\n`);
    return true;
  }
  return /^\/\/\s*#autoindex/.test(file);
}
