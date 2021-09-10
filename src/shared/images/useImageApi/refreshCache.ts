import chalk from "chalk";
import { format } from "date-fns";
import { IExifToolMetadata, IImageCacheRef, IImageRule } from "~/@types/image-types";
import { DevopsError } from "~/errors";
import { logger } from "~/shared/core/logger";
import { emoji } from "~/shared/ui";
import { IImageTools } from "../useImageApi";
import { buildTagsFromCache } from "./buildTagsFromCache";
import { saveImageCache } from "./saveImageCache";

/**
 * Refreshes the cache to disk and memory
 */
export async function refreshCache(rule: IImageRule, tools: IImageTools, stale: string[]) {
  const log = logger();
  type SourceImage = [sharp: IImageCacheRef, exif: IExifToolMetadata | undefined];
  const sourceImages: Promise<SourceImage>[] = [];
  const optimizedImages: Promise<IImageCacheRef[]>[] = [];

  const now = Date.now();
  for (const file of stale) {
    sourceImages.push(
      Promise.all([
        tools.sharp.getMetadata(file).then(
          (m) =>
            ({
              file,
              created: tools.cache.source[file]?.created || now,
              modified: now,
              isSourceImage: true,
              rule: rule.name,

              size: m.size,
              width: m.width,
              height: m.height,

              metaDetailLevel: "basic",
              sharpMeta: m,
            } as IImageCacheRef)
        ),
        (rule.metaDetail !== "basic"
          ? rule.metaDetail === "categorical"
            ? tools.exif.categorizedMetadata(file)
            : tools.exif.getMetadata(file)
          : Promise.resolve()) as Promise<IExifToolMetadata | undefined>,
      ])
    );

    optimizedImages.push(tools.sharp.resizeToWebFormats(file, rule.destination, rule.widths));
  }
  /** source images */
  const sis = await Promise.all(sourceImages);
  for (const si of sis) {
    const [cacheRef, exifMeta] = si;
    tools.cache.source[cacheRef.file] = {
      ...cacheRef,
      meta: exifMeta,
      metaDetailLevel: rule.metaDetail,
    };
  }

  /**
   * the web-optimized images after having been generated,
   * are now now mapped to cache refs
   */
  const optimized = (await Promise.all(optimizedImages)).flat().map(
    (i) =>
      ({
        ...i,
        rule: rule.name,
        isSourceImage: false,
        metaDetailLevel: "basic",
        meta: {},
      } as unknown as IImageCacheRef<"basic">)
  );

  for (const f of optimized) {
    tools.cache.converted[f.file] = f;
  }

  saveImageCache(tools.cache);

  log.info(
    `- ${emoji.thumbsUp} image cache saved to disk with updated source and converted images`
  );

  log.whisper(
    chalk`{dim - using the "${rule.name}" rule, {bold ${optimized.length}} images have been resized using Sharp to fit "web formats"}`
  );

  if (rule.preBlur) {
    const waitBlurry = [];
    for (const file of stale) {
      waitBlurry.push(tools.sharp.blurredPreImage(file, rule.destination));
    }
    const blurred = await Promise.all(waitBlurry);
    log.whisper(
      chalk`{dim - produced a blurred image preload for ${blurred.length} images associated to "${rule.name}" rule}`
    );
  }

  const metaMessages: string[] = [];

  if (!rule.preserveMeta) {
    metaMessages.push(
      "all meta data from the original image will be preserved in the converted image",
      "note that colorspace profile was converted to sRGB in conversion process and this will not be reverted back"
    );
  } else {
    metaMessages.push(
      "all meta data from the original image was removed and a web friendly sRGB color profile was added to the converted image"
    );
  }

  if (rule.copyright) {
    metaMessages.push(
      "a copyright notice was associated to this rule and will be applied to converted images"
    );
  }

  log.whisper(
    `- looking at metadata requirements for the optimized images; will apply the following policy:\n    - ${metaMessages.join(
      "\n    - "
    )}`
  );

  if (rule.preserveMeta && rule.preserveMeta.length > 0) {
    const metaTransfers = [];
    for (const file of optimized) {
      if (!file.from) {
        throw new DevopsError(
          `Attempt to bring metadata over to "${file.file}" file failed as the 'from' property in the cache was not populated!`,
          "image/not-ready"
        );
      }
      const cacheEntry = tools.cache.source[file.from];
      if (!cacheEntry) {
        throw new DevopsError(
          `Failed to bring metadata over to "${file.file}" file because there was no cache entry for the source image: ${file.from}`
        );
      }

      metaTransfers.push(
        tools.exif.setTags(file.file, buildTagsFromCache(rule.preserveMeta, tools.cache, file.from))
      );
    } // close resized loop
    await Promise.all(metaTransfers);
    log.whisper(
      chalk`- Metadata properties -- {italic ${rule.preserveMeta.join(
        ", "
      )}} -- have been added to the web images where they were available in the source image`
    );
  } // preserveMeta

  if (rule.copyright) {
    const cpPromises = [];
    for (const file of optimized) {
      cpPromises.push(tools.exif.addCopyright(file.file, rule.copyright));
    }
    await Promise.all(cpPromises);
    log.whisper(
      chalk`- copyright notices have been applied to the {yellow {bold ${optimized.length}}} images which were created as a result of recent changes to source files`
    );
  }

  log.info(
    chalk`- ${
      emoji.party
    } all images are now up-to-date based on recent source image changes [ {dim ${format(
      Date.now(),
      "h:mm:ss aaaa"
    )}} ]`
  );
}
