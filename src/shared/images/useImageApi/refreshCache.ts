import chalk from "chalk";
import { format } from "date-fns";
import { IImageRule } from "~/@types/image-types";
import { DevopsError } from "~/errors";
import { logger } from "~/shared/core/logger";
import { emoji } from "~/shared/ui";
import { IImageTools } from "../useImageApi";
import { buildTagsFromCache } from "./buildTagsFromCache";

/**
 * Refreshes the cache to disk and memory
 */
export async function refreshCache(rule: IImageRule, tools: IImageTools, stale: string[]) {
  const log = logger();
  const metaPromises = [];
  const resizePromises = [];
  for (const file of stale) {
    metaPromises.push(
      tools.exif.getMetadata(file, true).then(
        (i) =>
          (tools.cache.source[file] = {
            ...tools.cache.source[file],
            meta: { ...tools.cache.source[file].meta, ...i, metaDetailLevel: "tags" },
          })
      )
    );
    resizePromises.push(
      tools.sharp.resizeToWebFormats(
        file,
        rule.destination,
        rule.widths,
        rule.preserveMeta ? {} : {}
      )
    );
  }
  const resized = (await Promise.all(resizePromises)).flat();
  log.whisper(
    chalk`{dim - using the "${rule}" rule, {bold ${resized.length}} images have been resized using Sharp to fit "web formats"}`
  );
  if (rule.preBlur) {
    const waitBlurry = [];
    for (const file of stale) {
      waitBlurry.push(tools.sharp.blurredPreImage(file, rule.destination));
    }
    // TODO: fix output format for promises here; we're just getting a string right now
    const blurred = await Promise.all(waitBlurry);
    log.whisper(
      `{dim - produced a blurred image preload for ${blurred.length} images associated to "${rule}" rule}`
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
    `- looking at metadata for converted images and will apply the following policy:\n- ${metaMessages.join(
      "\n- "
    )}`
  );

  await Promise.all(metaPromises);
  if (rule.preserveMeta && rule.preserveMeta.length > 0) {
    const metaTransfers = [];
    for (const file of resized) {
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
    for (const file of resized) {
      cpPromises.push(tools.exif.addCopyright(file.file, rule.copyright));
    }
    await Promise.all(cpPromises);
    log.whisper(
      chalk`- copyright notices have been applied to the {yellow {bold ${resized.length}}} images which were created as a result of recent changes to source files`
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
