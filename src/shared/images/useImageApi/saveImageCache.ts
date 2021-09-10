import { IImageCache } from "~/@types";
import { IMAGE_CACHE } from "~/constants";
import { write } from "~/shared/file";

export function saveImageCache(cache: IImageCache) {
  write(IMAGE_CACHE, JSON.stringify(cache), { allowOverwrite: true });
}
