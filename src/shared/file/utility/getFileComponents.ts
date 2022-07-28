import { IFilenameComponents } from "src/@types/file-types";
import { toRelativePath } from "../relativePath";

/**
 * Breaks files into parts so that they can be treated separately
 */
export function getFileComponents(filepath: string, base?: string): IFilenameComponents {
  const relative = toRelativePath(filepath, base);
  const parts = relative.split("/");
  const start = parts.length > 1 ? parts[0] : "";
  const mid = parts.length > 2 ? parts.slice(1, -1).join("/") : "";
  const filename = parts.slice(-1)[0];
  const match = filename.trim().match(/\.(\w*)$/) as [string, string];
  const ext = match[1];
  const re = new RegExp(`\.${ext}`);

  const fileWithoutExt = filename.replace(re, "");

  return {
    start,
    mid,
    filename,
    fileWithoutExt,
    ext,
    filepath: [start, mid].join("/"),
    full: filepath,
  };
}
