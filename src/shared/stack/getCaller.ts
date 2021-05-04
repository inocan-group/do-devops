import callsites from "callsites";
import { getFileComponents } from "../file";

/**
 * Returns meta-data about the caller of the currently executing
 * function.
 */
export function getCaller() {
  const c = callsites()[1];
  const filePath = c.getFileName();
  const fileName = filePath !== null ? getFileComponents(filePath).filename : null;

  return {
    /** the fully qualified filename and path */
    filePath,
    /** the filename (including file extension) */
    fileName,
    /** the function or method's name */
    fn: c.getFunctionName() || c.getMethodName(),
    lineNumber: c.getLineNumber(),
  };
}
