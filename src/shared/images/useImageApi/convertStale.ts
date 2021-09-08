import chalk from "chalk";
import { IImageCacheRef, IImageRule } from "~/@types/image-types";
import { logger } from "~/shared/core";
import { emoji } from "~/shared/ui";
import { IImageApiOptions, IImageTools } from "../useImageApi";
import { checkCacheFreshness } from "./checkCacheFreshness";
import { refreshCache } from "./refreshCache";

/**
 * Ensures that all image conversions are done to avoid having stale
 * rule dependencies.
 */
export async function convertStale(
  rules: IImageRule[],
  tools: IImageTools,
  _options: IImageApiOptions
) {
  const log = logger();
  // iterate over rules
  for (const rule of rules) {
    log.info(chalk`- checking rule {blue ${rule}} for stale conversions`);
    const { missing, outOfDate } = await checkCacheFreshness(tools.cache, rule.source, rule.glob);
    if (missing.length > 0) {
      log.whisper(
        chalk`- there are ${missing.length} images not currently in the cache: {dim ${missing.join(
          ", "
        )}}`
      );
    }
    if (outOfDate.length > 0) {
      log.whisper(
        chalk`- there are ${outOfDate.length} images who are out of date: {dim ${missing.join(
          ", "
        )}}`
      );
    }
    if (missing.length === 0 && outOfDate.length === 0) {
      log.info(`- ${emoji.party} all images in {blue ${rule}} are current; no work needed.`);
    } else {
      // freshen up rule
      await refreshCache(rule, tools, [...missing, ...outOfDate]);
      const changes = [...missing, ...outOfDate];
      log.info(`- ${changes.length} source images in {blue ${rule}} were updated in cache`);
      const resized: Promise<IImageCacheRef[]>[] = [];
      for (const img of changes) {
        resized.push(tools.sharp.resizeToWebFormats(img, rule.destination, rule.widths));
      }
      const resizedComplete = [...(await Promise.all(resized))].flat();
      log.whisper(
        chalk`- the following images were {italic resized}:\n${resizedComplete
          .map((i) => i.file)
          .join("\t")}\n`
      );
      log.info(
        `- ${emoji.party} all converted images stemming for source changes has complete; all files are up-to-date`
      );
    }
  } // rules iteration
}
