import { Stats } from "fs";
import globby from "globby";
import { join } from "path";
import { IImageCache } from "~/@types";
import { repoDirectory } from "~/shared/file";

type IGlobResultWithStats = {
  name: string;
  path: string;
  dirent: any;
  stats: Stats;
};

export async function checkCacheFreshness(
  cache: IImageCache,
  baseDir: string,
  globPattern: string
) {
  const targetFiles = (
    (await globby(globPattern, {
      cwd: join(repoDirectory(), baseDir),
      onlyFiles: true,
      stats: true,
      caseSensitiveMatch: false,
    })) as unknown as IGlobResultWithStats[]
  ).map((i) => ({ name: i.path, modified: i.stats.mtimeMs }));

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

  return { missing, outOfDate };
}
