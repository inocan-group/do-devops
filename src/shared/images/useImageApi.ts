import destr from "destr";
import { join } from "path";
import type { IImageCache } from "~/@types";
import { IMAGE_CACHE } from "~/constants";
import { fileExists } from "../file";
import { readFile } from "../file/crud/readFile";
import { checkCacheFreshness } from "./useImageApi/checkCacheFreshness";
import { refreshCache } from "./useImageApi/refreshCache";

export interface IGetImageOptions {}

/** options for setting up the image cache API */
export interface IImageCacheOptions {
  /** force reload of image cache even if it exists on disk */
  clearCache?: boolean;
}

/**
 * Returns an API surface for working with _images_ which is backed by a file/memory cache
 * so that updates are as efficient as possible. This API is supported by:
 * - **Sharp** for image conversion, and
 * - **ExifTool** for meta data.
 */
export function useImageApi(baseDir: string, globPattern: string, options: IImageCacheOptions) {
  const cacheFile = join(baseDir, IMAGE_CACHE);
  const cache = (
    fileExists(cacheFile) && !options.clearCache
      ? destr(readFile(cacheFile))
      : { source: {}, converted: {} }
  ) as IImageCache;
  const { missing, outOfDate } = await checkCacheFreshness(cache, baseDir, globPattern);
  await refreshCache(cache, [...missing, ...outOfDate]);

  const api = {
    /**
     * watches for changes in defined image rules and reacts to changes by
     * both updating the cache as well as re-creating "converted" images as
     * needed.
     */
    watch: async () => {
      await convertStale(rules);
      console.log(
        "Image cache and images are current. Watching file system for changes to source images."
      );
    },
    convert: async () => {
      //
    },
    summarize: async () => {},
  };

  return api;
}
