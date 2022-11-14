/* eslint-disable no-use-before-define */
import chalk from "chalk";
import destr from "destr";
import type { IImageCache, IImageRule } from "src/@types";
import { IMAGE_CACHE } from "src/constants";
import { logger } from "../core";
import { readFile, fileExists } from "../file";
import { convertStale } from "./useImageApi/convertStale";
import { watchForChange } from "./useImageApi/watchForChange";
import { summarize } from "./useImageApi/summarize";
import { useExifTools } from "./useExifTools";
import { useSharp } from "./useSharp";

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
      ? chalk.dim`- cache file found on disk, loading ...`
      : options.clearCache === true
      ? chalk.dim`- starting with clean cache due to "clearCache" flag`
      : chalk.dim`- no cache file found on disk, will start with clean cache`
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
      return summarize(rules, tools);
    },
    /**
     * Gets the metadata for an image using **ExifTool**. By default, the data returned is a pure
     * key/value pairing of all metadata but if you set `format` to "categorical" you'll get a more
     * compact and de-dupped set of tags.
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
