import { existsSync, readFileSync } from "fs";

import { join } from "path";

/**
 * Get's the name(s) of the scaffolding repo(s) used for the given project. The return
 * is always an array of strings; if no scaffold is found then the array will be empty.
 *
 * Note: it is _possible_ that there is more than one but this would be considered
 * highly unusual.
 */
export function getYeomanScaffolds() {
  const yoFile = join(process.cwd(), ".yo-rc.json");
  const hasYo = existsSync(yoFile);

  if (!hasYo) {
    return [];
  }

  return Object.keys(JSON.parse(readFileSync(yoFile, "utf-8")));
}
