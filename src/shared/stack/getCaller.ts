import callsites from "callsites";
import { getFileComponents } from "src/shared/file";

/**
 * Returns meta-data about the caller of the currently executing
 * function.
 */
export function getCaller() {
  const c = callsites()[2];
  const fqName = c.getFileName();
  const fileName = fqName !== null ? getFileComponents(fqName).filename : null;
  const filePath = fqName !== null ? fqName?.replace(fileName as string, "") : null;

  return {
    /** the fully qualified path to the file (excludes file name) */
    filePath,
    /** the filename (including file extension) */
    fileName,
    /** the function or method's name */
    fn: c.getFunctionName() || c.getMethodName(),
    /** boolean flag indicating whether or not caller was a method on a class */
    isClassMethod: c.getMethodName() !== null,
    lineNumber: c.getLineNumber(),
  };
}
