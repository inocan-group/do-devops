import { WriteTags } from "exiftool-vendored";
import { IImageCache, ImageMetadata } from "~/@types/image-types";

/**
 * Creates a dictionary of name/value pairs from a source file's cache, given an
 * expressed interest in certain ExifTool "writable tags".
 */
export function buildTagsFromCache(
  tags: Array<keyof WriteTags>,
  cache: IImageCache,
  sourceFile: string
) {
  return tags.reduce((acc, tag) => {
    acc = { ...acc, [tag]: cache.source[sourceFile].meta[tag as keyof ImageMetadata] };
    return acc;
  }, {});
}
