/* eslint-disable no-use-before-define */
import chalk from "chalk";
import destr from "destr";
import type { IImageCache, IImageRule } from "~/@types";
import { IMAGE_CACHE } from "~/constants";
import { useExifTools } from ".";
import { logger } from "../core";
import { fileExists } from "../file";
import { readFile } from "../file/crud/readFile";
import { convertStale } from "./useImageApi/convertStale";
import { watchForChange } from "./useImageApi/watchForChange";
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
  const cache = (
    fileExists(IMAGE_CACHE) && !options.clearCache
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
    summarize: async () => {
      for (const r of rules || []) {
        log.info(
          chalk`  - ${r.name}: {dim source: "${r.source}", destination: "${r.destination}", glob: "${r.glob}"}`
        );
      }
    },

    getMetaForImage: async (image: string, format: "tags" | "categorical" = "tags") => {
      return format === "tags" ? exif.getMetadata(image) : exif.categorizedMetadata(image);
    },
  };

  return api;
}
