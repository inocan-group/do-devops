import { IOptimizedImage } from "common-types";
import { IImageRule } from "~/@types";
import { getFileComponents, write } from "~/shared/file";
import { IImageTools } from "..";

export const TS_IMAGE_SUPPORT_FILE = `src/images/optimized-images.ts`;

/**
 * Adds a TS file to the a repo's source that helps to navigate the
 * dynamically generated optimized images from the `dd image optimize`
 * solution.
 */
export function createTsSupportFile(rules: IImageRule[], tools: IImageTools) {
  const lookups: Record<string, IOptimizedImage> = {};

  for (const key of Object.keys(tools.cache.source)) {
    const si = tools.cache.source[key];
    const rule = rules.find((i) => i.name === si.rule) as IImageRule;
    const parts = getFileComponents(si.file);
    lookups[parts.fileWithoutExt] = {
      name: parts.fileWithoutExt,
      widths: rule.widths,
      formats: ["jpg", "png", "webp"],
      path: parts.filepath,
      aspectRatio: si.width / si.height,
    };
  }

  const file = `
  import type { IOptimizedImage } from "common-types";\n
  /** 
   * a key/value lookup of available optimized images where the _key_ is
   * the name of the image without 
   */
  export const OptimizedImageLookup: Record<string, IOptimizedImage> = ${JSON.stringify(
    lookups,
    null,
    2
  )}  as const;
  
  export interface IOptimizedImages = keyof typeof OptimizedImageLookup;
  export enum OptimizedImage {

  };

  `;

  write(TS_IMAGE_SUPPORT_FILE, file);
}
