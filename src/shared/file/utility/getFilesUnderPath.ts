import { globby } from "globby";

/**
 * Uses a glob utility to identify all files under a given path.
 *
 * You may optionally limit the files to just a certain file extension.
 *
 * Errors:
 * - `files/directory-does-not-exist`
 */
export async function getFilesUnderPath(dir: string, extension?: string): Promise<string[]> {
  dir = dir.replace(/\\/g, "/");
  const pattern = extension ? `${dir}/**/*.${extension}` : `${dir}/**`;
  const files = await globby(pattern);

  return files || [];
}
