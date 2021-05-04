import chalk from "chalk";
import { IGlobalOptions } from "~/@types";
import { logger } from "~/shared/core";
import { currentDirectory, readFile, fileIncludes, tscValidation } from "~/shared/file";

/**
 * Validates that:
 *  - the `Serverless()` helper is both imported and used,
 *  - that it is exported as a default export
 *  - no errors are thrown by `tsc --noEmit`
 */
export function isValidServerlessTs(fn?: string, opts: IGlobalOptions = {}) {
  const log = logger(opts);
  const filename = fn || currentDirectory("serverless.ts");
  const contents = readFile(filename);

  log.info(chalk`{gray - validating integrity of {blue serverless.ts} file}`);

  if (!contents) {
    return false;
  }
  if (!fileIncludes(filename, "aws-orchestrate", "import", "export default")) {
    return false;
  }
  log.whisper(chalk`{gray - {blue serverless.ts} file {italic looks} structurally valid }`);

  log.whisper(
    chalk`{gray - attempting {bold tsc} transpilation of {blue serverless.ts}} to ensure validity`
  );
  if (!tscValidation(filename, opts)) {
    return false;
  }
  log.whisper(chalk`{gray - transpilation was successful}`);

  return true;
}
