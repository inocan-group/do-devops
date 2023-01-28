import chalk from "chalk";
import { Stats } from "node:fs";
import { globby } from "globby";
import { join } from "node:path";
import { IImageCache, IImageRule } from "src/@types/image-types";
import { logger } from "src/shared/core";
import { repoDirectory } from "src/shared/file/base-paths/repoDirectory";

type IGlobResultWithStats = {
  name: string;
  path: string;
  dirent: any;
  stats: Stats;
};

export interface ICacheFreshness {
  /**
   * A list of filenames which were missing from the
   * existing cache. These filenames will have relative
   * paths from the project's root directory.
   */
  missing: string[];
  /**
   * A list of filenames which _were_ found in the existing
   * cache but with dates which were out-of-date. These filenames
   * will have relative paths from the project's root directory.
   */
  outOfDate: string[];
}

export async function checkCacheFreshness(
  cache: IImageCache,
  rule: IImageRule
): Promise<ICacheFreshness> {
  const log = logger();
  const baseDir = rule.source;
  const globPattern = rule.glob;

  const targetFiles = (
    (await globby(globPattern, {
      cwd: join(repoDirectory(), baseDir),
      onlyFiles: true,
      stats: true,
      caseSensitiveMatch: false,
    })) as unknown as IGlobResultWithStats[]
  ).map((i) => ({ name: join(baseDir, i.path), modified: i.stats.mtimeMs }));

  const missing = [];
  const outOfDate = [];

  for (const file of targetFiles) {
    const cacheRef = cache.source[file.name];

    if (!Object.keys(cache.source).includes(file.name)) {
      missing.push(file.name);
    } else if (cacheRef.modified < file.modified) {
      outOfDate.push(file.name);
    }
  }

  log.whisper(
    chalk.dim`- there were {bold ${targetFiles.length}} source images discovered for the ${chalk.blue(rule.name)} rule. Of which ${missing.length} were ${chalk.italic`missing`} from the cache and ${outOfDate.length} were in the cache but stale.`
  );

  return { missing, outOfDate };
}
