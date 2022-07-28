import { WriteTags } from "exiftool-vendored";
import { IImageCache, IImageCacheRef } from "src/@types/image-types";

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
    const c = cache.source[sourceFile] as IImageCacheRef<"tags">;
    acc = { ...acc, [tag]: c.meta[tag] };
    return acc;
  }, {} as Record<string | keyof WriteTags, any>);
}
