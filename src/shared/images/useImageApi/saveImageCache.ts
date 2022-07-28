import { IImageCache } from "src/@types";
import { IMAGE_CACHE } from "src/constants";
import { write } from "src/shared/file/crud/write";

export function saveImageCache(cache: IImageCache) {
  write(IMAGE_CACHE, JSON.stringify(cache), { allowOverwrite: true });
}
