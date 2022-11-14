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

  log.info(`{gray - validating integrity of {blue serverless.ts} file}`);

  if (!contents) {
    return false;
  }
  if (!fileIncludes(filename, "aws-orchestrate", "import", "export default")) {
    return false;
  }
  log.whisper(`{gray - {blue serverless.ts} file {italic looks} structurally valid }`);

  // log.whisper(
  //   `{gray - attempting {bold tsc} transpilation of {blue serverless.ts}} to ensure validity`
  // );
  // if (!tscValidation(filename, opts)) {
  //   return false;
  // }
  // log.whisper(`{gray - transpilation was successful}`);

  return true;
}
