import destr from "destr";
import { join } from "path";
import { IImageCacheRef } from "~/@types";
import { IMAGE_CACHE } from "~/constants";
import { fileExists } from "../file";
import { readFile } from "../file/crud/readFile";

export interface IGetImageOptions {
  metaDataDetail: 
};

/** options for setting up the image cache API */
export interface IImageCacheOptions {
  /** force reload of image cache even if it exists on disk */
  clearCache?: boolean;
}


/**
 * Returns an API surface for working with _images_ which is backed by a file/memory cache
 * so that updates are as efficient as possible. This API is supported by **Sharp** for
 * image conversion and **ExifTool** for meta data.
 */
export function useImageApi(baseDir: string, globPattern: string, options: IImageCacheOptions) {
  const cacheFile = join(baseDir, IMAGE_CACHE);
  const cache = fileExists(cacheFile) && !options.clearCache ? destr(readFile(cacheFile)) as Record<string, IImageCacheRef> : {};
  const [needsRefresh, newImages] = checkCacheFreshness(cache);

  return {
    /** 
     * Provides metadata for a given image. 
     * 
     * The level of metadata is by default very basic, but can be switched to one of 
     * three levels based on options settings.
     */
    getImageMeta(image: string, _options: IGetImageOptions = {}) => {
      // 
    },



  };
}
