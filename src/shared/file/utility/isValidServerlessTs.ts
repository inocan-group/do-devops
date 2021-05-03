import { currentDirectory, readFile, fileIncludes, tscValidation } from "~/shared/file";

/**
 * Validates that:
 *  - the `Serverless()` helper is both imported and used,
 *  - that it is used within a asynchronous code block (and _awaited_ for)
 *  - no errors are thrown by `tsc --noEmit`
 */
export function isValidServerlessTs(fn?: string) {
  const filename = fn || currentDirectory("serverless.ts");
  const contents = readFile(filename);
  if (!contents) {
    return false;
  }
  if (!fileIncludes(filename, "aws-orchestrate", "import", "export default", "await Serverless")) {
    return false;
  }
  if (!tscValidation(filename)) {
    return false;
  }

  return true;
}
