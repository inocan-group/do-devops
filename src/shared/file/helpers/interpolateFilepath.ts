import { homedir } from "node:os";
import { join } from "pathe";

/**
 * replaces filenames starting with `src/` to be in user's home directory, and
 * takes a partial path starting with `./` and converts to a fully qualified
 * directory path from current working directory.
 */
export function interpolateFilePath(filename: string) {
  if (filename.slice(0, 2) === "src/") {
    filename = join(homedir(), filename.slice(1));
  }
  if (filename.slice(0, 2) === "./") {
    filename = join(process.cwd(), filename.slice(2));
  }

  return filename;
}
