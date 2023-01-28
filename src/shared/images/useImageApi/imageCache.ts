import chalk from "chalk";
import { IDictionary } from "common-types";
import { keys } from "native-dash";
import { GlobalOptions, IImageCacheRef, IRefreshCacheOptions } from "src/@types";
import { IMAGE_CACHE } from "src/constants";
import { logger } from "../../core";
import { currentDirectory } from "../../file";
import { repoDirectory } from "../../file/base-paths/repoDirectory";
import { readAndParseFile } from "../../file/crud/readAndParseFile";

/**
 * The cache holds all image metadata that it gets
 * from operations of a given process. It is used
 * to eliminate unnecessary reads from the file-based
 * cache but the user of the cache API must be
 * responsible for ensuring that the memory cache
 * in a known state before writing back to the file
 * cache.
 */
let MEM_CACHE: Record<string, IImageCacheRef> = {};

/**
 * Loads all images from the current image cache into the memory
 * cache. If the there isn't already a disk cache file then the
 * memory cache will be started as an empty dictionary.
 *
 * **Note:** the cache file will be looked for in the _current working directory_
 * but if not present it will look up the stack for directory with a `package.json`
 * and look there too.
 */
export function loadImageCache() {
  MEM_CACHE =
    readAndParseFile<IDictionary<IImageCacheRef>>(currentDirectory(IMAGE_CACHE)) ||
    readAndParseFile<IDictionary<IImageCacheRef>>(repoDirectory(IMAGE_CACHE)) ||
    {};

  return MEM_CACHE;
}

/** clears the in-memory cache to an empty dictionary */
export function clearCache() {
  MEM_CACHE = {};
}

export function getFromImageCache(image: string, opts: GlobalOptions) {
  const log = logger(opts);
  if (MEM_CACHE[image]) {
    return MEM_CACHE[image];
  }
  log.shout(chalk.gray`- ${chalk.yellow.bold(keys(MEM_CACHE).length)} images retrieved from image cache`);
  loadImageCache();
  return MEM_CACHE[image];
}

/**
 * Returns up-to-date meta data for given images files; results are
 * returned where up-to-date results are available from cache (memory
 * then disk) but if not yet available it will create it and make sure
 * the memory and file caches are updated.
 */
export async function refreshCache(_images: string[], _opts: GlobalOptions<IRefreshCacheOptions> = {}) {
  // TODO: bring back once compiling
  // const log = logger(opts);
  const cache = loadImageCache();
  // const info = await fileInfo(...images);
  // const promises: Promise<IImageMetadata>[] = [];

  /**
   * iterate over images passed in
   */
  // for (const img of images) {
  // if (cache[img] && !opts?.force) {
  //   // image is in cache
  //   if (info[img].atime !== c[img].updated) {
  //     promises.push(createMetaFor(f, img));
  //   } else {
  //     cache[img] = c[img];
  //   }
  // } else {
  //   // either wasn't in cache or force flag used
  //   promises.push(createMetaFor(f, img));
  // }
  // }

  // const misses = await Promise.all(promises);
  // for (const miss of misses) {
  //   const file = miss.file;
  //   cache[file] = miss;
  // }

  // if (misses.length > 0) {
  //   write(repoDirectory(IMAGE_CACHE), JSON.stringify({ ...c, ...cache }, null, 2));
  // }

  return cache;
}
