import { toRelativePath } from "~/shared/file";

/**
 * Breaks files into parts so that they can be treated separately
 */
export function getFileComponents(filepath: string, base?: string) {
  const relative = toRelativePath(filepath, base);
  const parts = relative.split("/");
  const start = parts[0];
  const mid = parts.slice(1, -1).join("/");
  const end = parts.slice(-1)[0];
  const match = end.trim().match(/\.(\w*)$/) as [string, string];
  const ext = match[1];
  const re = new RegExp(`\.${ext}`);
  const filename = end.replace(re, "");

  return { start, mid, end, filename, ext, filepath: [start, mid].join("/") };
}
