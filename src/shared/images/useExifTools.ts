import chalk from "chalk";
import { exiftool, Tags, WriteTags } from "exiftool-vendored";
import { IExifToolMetadata, IptcCreatorContactInfo } from "src/@types/image-types";
import { DevopsError } from "../../errors";
import { removeFile } from "../file";
import { improveMetaResults } from "./useExifTool/conversion-tools";
import { metaReducer } from "./useExifTool/metaCategories";

// DOCS: https://photostructure.github.io/exiftool-vendored.js/

export type IExifToolOptions = {};
const cache: Record<string, IExifToolMetadata> = {};

/** removed the `_original` file created by ExifTool writes */
async function removeOriginalFile(file: string) {
  const original = `${file}_original`;
  console.log("removing:", original);

  removeFile(original);
}

/**
 * refreshes the meta-data for a given image if it's not already
 * in the cache.
 *
 * Note: no action is taken if returnMeta is not set and the image
 * wasn't already in the cache.
 */
async function refreshCache(image: string, returnMeta: boolean, payload: WriteTags) {
  if (returnMeta) {
    // refresh metadata

    if (cache[image]) {
      cache[image] = { ...cache[image], ...payload } as IExifToolMetadata;
    } else {
      // force reload; no need to add payload manually in this case
      await useExifTools().getMetadata(image, true);
    }
  } else {
    // not asking for a return; so only updated cache if image is already there
    cache[image] = { ...cache[image], ...payload } as IExifToolMetadata;
  }
}

/**
 * Provides a useful API surface for intereacting with **ExifTools**:
 * [ [site](https://exiftool.org/), [npm module](https://photostructure.github.io/exiftool-vendored.js/) ]
 */
export function useExifTools(options: IExifToolOptions = {}) {
  // not using options yet
  const _o = {
    ...options,
  };

  const api = {
    version: async () => {
      return exiftool.version();
    },
    /**
     * returns full metadata for a given file using ExifTool
     *
     * Note: the _interface_ may not know about all images in the file
     * -- though it does provide many -- so to aid typing we return a
     * `TagsPlusMissing` type which has a generic `T` you can use how you
     * see fit. By default it will allow any string prop with type _unknown_.
     */
    getMetadata: async <T extends { [key: string]: unknown }>(
      file: string,
      force = false
    ): Promise<IExifToolMetadata<T>> => {
      if (Object.keys(cache).includes(file) && !force) {
        return cache[file] as unknown as IExifToolMetadata<T>;
      }
      // ExifTool
      const meta = improveMetaResults<T>(await exiftool.read(file));
      cache[file] = meta;
      return meta;
    },
    /**
     * Remove metadata from a given photo file
     *
     * @param image the original's filename
     * @param keepOriginalCopy if set to true it will create another file with `_original`
     * added to its name
     */
    removeAllMeta: async (image: string, keepOriginalCopy: boolean = false) => {
      await exiftool.deleteAllTags(image).catch((error) => {
        if (error.message.includes("No success message")) {
          console.log(
            `- possible failure removing tags from "${image}" but this error message can often be ignored.`
          );
        } else {
          throw error;
        }
      });
      if (cache[image]) {
        cache[image] = {} as IExifToolMetadata;
      }

      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
    },
    /**
     * Adds a meta tag to an existing image; if that tag already exists then this operation will
     * fail with an error of type `exif-tool/tag-exists`.
     */
    addTag: async <K extends keyof WriteTags>(
      file: string,
      tag: K & string,
      value: WriteTags[K],
      keepOriginalCopy: boolean = false
    ) => {
      if (!cache[file]) {
        await useExifTools(_o).getMetadata(file);
      }
      if (cache[file][tag] !== undefined) {
        throw new DevopsError(
          `Attempt to add "${tag}" on the image ${chalk.blue(file)} failed as this property already exists; use setTag() instead if you want to be able to overwrite.`,
          "exif-tool/tag-exists"
        );
      }
      await exiftool.write(file, { [tag]: value });
      cache[file] = { ...cache[file], [tag]: value as unknown as IExifToolMetadata };

      if (!keepOriginalCopy) {
        removeOriginalFile(file);
      }
      return cache[file];
    },

    addContactInfo: async <R extends boolean>(
      file: string,
      contactInfo: IptcCreatorContactInfo,
      returnMeta: R = false as R,
      keepOriginalCopy: boolean = false
    ) => {
      return await api.setTags(
        file,
        { CreatorContactInfo: contactInfo },
        returnMeta,
        keepOriginalCopy
      );
    },

    /**
     * Writes a meta tag to an existing tag; overwriting any value that may have existed there before it.
     *
     * To improve performance, this only returns void unless you specify that you want the updated metadata
     * back as part of the return.
     */
    setTags: async <R extends boolean = false>(
      image: string,
      tags: WriteTags,
      returnMeta: R = false as R,
      keepOriginalCopy: boolean = false
    ) => {
      await exiftool.write(image, tags);
      // cache[image] = { ...cache[image], ...(tags as ExifTagsPlusMissing) };
      await refreshCache(image, returnMeta, tags);

      const results = (returnMeta ? cache[image] : undefined) as R extends true
        ? IExifToolMetadata
        : void;

      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
      return results;
    },

    /**
     * Removes one or more tags from a given file's metadata; you may optionally choose to receive the
     * updated metadata after removal.
     */
    removeTags: async <K extends keyof Tags, R extends boolean = false>(
      image: string,
      tags: K | K[],
      returnMeta: R = false as R,
      keepOriginalCopy: boolean = false
    ) => {
      if (!Array.isArray(tags)) {
        tags = [tags];
      }
      const eraser = tags.reduce((acc, item) => {
        acc = { ...acc, [item]: undefined };
        return acc;
      }, {} as Record<string, undefined>);

      await exiftool.write(image, eraser);
      await refreshCache(image, returnMeta, eraser);

      const results = (returnMeta ? cache[image] : undefined) as R extends true
        ? IExifToolMetadata
        : void;
      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }
      return results;
    },

    /**
     * Adds a copyright message to appropriate meta data fields
     */
    addCopyright: async <R extends boolean>(
      image: string,
      message: string,
      returnMeta: R = false as R,
      keepOriginalCopy: boolean = false
    ) => {
      const payload = {
        Copyright: message,
        CopyrightNotice: message,
      };
      const result = await api.setTags(image, payload, returnMeta, keepOriginalCopy);
      await refreshCache(image, returnMeta, payload);

      return result as R extends true ? IExifToolMetadata : void;
    },
    /**
     * Sets the "title" of the image to all relevant meta-data properties
     */
    setTitle: async <R extends boolean>(
      image: string,
      title: string,
      returnMeta: R = false as R,
      keepOriginalCopy: boolean = false
    ) => {
      const payload = {
        Title: title,
        XPTitle: title,
      };

      await exiftool.write(image, payload);
      await refreshCache(image, returnMeta, payload);
      if (!keepOriginalCopy) {
        removeOriginalFile(image);
      }

      return (returnMeta ? cache[image] : undefined) as R extends true ? IExifToolMetadata : void;
    },
    /**
     * Returns the metadata derived from **ExifTool** but grouped into a set of useful
     * categories where only one value per category is presented. The idea is for this
     * to be a more useful way of presenting meta-data in a consistent manner, however,
     * it is an abstraction so you'll not want to work with this distraction on writes.
     */
    categorizedMetadata: async (file: string) => {
      if (!cache[file]) {
        await useExifTools(_o).getMetadata(file);
      }
      return metaReducer(cache[file]);
    },

    /**
     * if you are done using ExifTool it's best to close to give back the
     * resource but if you might continue to use do not close it as this api
     * will no longer work after calling.
     */
    close: async () => {
      return exiftool.end();
    },
  };

  return api;
}
