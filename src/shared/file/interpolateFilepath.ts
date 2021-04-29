import { homedir } from "os";
import path from "path";

/**
 * replaces filenames starting with `~/` to be in user's home directory, and
 * takes a partial path starting with `./` and converts to a fully qualified
 * directory path from current working directory.
 */
export function interpolateFilePath(filename: string) {
  if (filename.slice(0, 1) === "~") {
    filename = path.posix.join(homedir(), filename.slice(1));
  }
  if (filename.slice(0, 2) === "./") {
    filename = path.posix.join(process.cwd(), filename.slice(2));
  }

  return filename;
}
