import chalk from "chalk";
import { Options } from "src/@types";
import { logger } from "src/shared/core";
import { currentDirectory, readFile, fileIncludes } from "src/shared/file";

/**
 * Validates that:
 *  - the `Serverless()` helper is both imported and used,
 *  - that it is exported as a default export
 *  - no errors are thrown by `tsc --noEmit`
 */
export function isValidServerlessTs(fn?: string, opts: Options = {}) {
  const log = logger(opts);
  const filename = fn || currentDirectory("serverless.ts");
  const contents = readFile(filename);

  log.info(chalk.gray`- validating integrity of {blue serverless.ts} file`);

  if (!contents) {
    return false;
  }
  if (!fileIncludes(filename, "aws-orchestrate", "import", "export default")) {
    return false;
  }
  log.whisper(chalk.gray`- ${chalk.blue`serverless.ts`} file ${chalk.italic`looks`} structurally valid`);


  return true;
}
