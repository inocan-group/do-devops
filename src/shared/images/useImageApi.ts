/* eslint-disable no-use-before-define */
import chalk from "chalk";
import destr from "destr";
import type { IImageCache, IImageCacheRef, IImageRule } from "~/@types";
import { IMAGE_CACHE } from "~/constants";
import { useExifTools, useSharp } from "~/shared/images";
import { logger } from "~/shared/core";
import { readFile, fileExists } from "~/shared/file";
import { convertStale } from "./useImageApi/convertStale";
import { watchForChange } from "./useImageApi/watchForChange";
import { formatDistance } from "date-fns";

export interface IGetImageOptions {}

/** options for setting up the image cache API */
export interface IImageApiOptions {
  /** force reload of image cache even if it exists on disk */
  clearCache?: boolean;
}

export interface IImageTools {
  exif: ReturnType<typeof useExifTools>;
  sharp: ReturnType<typeof useSharp>;
  cache: IImageCache;
}

export type ImageApi = ReturnType<typeof useImageApi>;

/**
 * Returns an API surface for working with _images_ which is backed by a file/memory cache
 * so that updates are as efficient as possible. This API is supported by:
 * - **Sharp** for image conversion, and
 * - **ExifTool** for meta data.
 */
export function useImageApi(rules: IImageRule[], options: IImageApiOptions = {}) {
  // gather shared resources across rules
  const log = logger();
  const exif = useExifTools();
  const sharp = useSharp();
  const cacheFileExists = fileExists(IMAGE_CACHE);

  log.whisper(
    cacheFileExists && options.clearCache !== true
      ? chalk`{dim - cache file found on disk, loading ...}`
      : options.clearCache === true
      ? chalk`{dim - starting with clean cache due to "clearCache" flag}`
      : chalk`{dim - no cache file found on disk, will start with clean cache}`
  );
  const cache = (
    cacheFileExists && options.clearCache !== true
      ? destr(readFile(IMAGE_CACHE))
      : { source: {}, converted: {} }
  ) as IImageCache;

  const tools: IImageTools = { exif, sharp, cache };

  // provide API surface
  const api = {
    /** the rules configured on the API */
    rules,
    /**
     * watches for changes in defined image rules and reacts to changes by
     * both updating the cache as well as re-creating "converted" images as
     * needed.
     */
    watch: async () => {
      await convertStale(rules, tools, options);
      await watchForChange(rules, tools, options);
    },
    convert: async () => {
      await convertStale(rules, tools, options);
    },
    /**
     * Summarize the current configuration for the Image service
     */
    summarize: async () => {
      const sourceImages = Object.keys(tools.cache.source).reduce((acc, i) => {
        acc = [...acc, tools.cache.source[i]];
        return acc;
      }, [] as IImageCacheRef[]);
      const convertedImages = Object.keys(tools.cache.converted).reduce((acc, i) => {
        acc = [...acc, tools.cache.source[i]];
        return acc;
      }, [] as IImageCacheRef[]);
      const lastUpdate = formatDistance(
        Date.now(),
        sourceImages.reduce(
          (mostRecent, i) => (i.modified > mostRecent ? i.modified : mostRecent),
          0
        )
      );
      log.info(chalk`{bold Summary of Image Configuration}`);
      log.info(chalk`{bold ------------------------------}\n`);

      log.info(
        chalk`- there are {yellow {bold ${sourceImages.length}}} source images in the cache`
      );
      log.info(chalk`- the last {italic detected change} in these source images was ${lastUpdate}`);
      log.info(
        chalk`{dim - the rules {italic plus} source images have produced {bold {yellow ${convertedImages.length}}} optimized images}`
      );

      log.info(chalk`Rule Overview:`);
      log.info(chalk`---------------`);

      for (const r of rules || []) {
        log.info(
          chalk`  - ${r.name}: {dim source: "${r.source}", destination: "${r.destination}", glob: "${r.glob}"}`
        );
      }
    },
    /**
     * Gets the metadata for an image using **ExifTool**. By default, the data returned is a pure
     * key/value pairing of all metadata but if you set `format` to "categorical" you'll get a more
     * compact and dedupped set of tags.
     */
    getMetaForImage: async (image: string, format: "tags" | "categorical" = "tags") => {
      return format === "tags" ? exif.getMetadata(image) : exif.categorizedMetadata(image);
    },
    /**
     * Because ExifTools keeps an open connection; it's definitely preferred that you close
     * after use.
     */
    close: async () => {
      return exif.close();
    },
  };

  return api;
}
