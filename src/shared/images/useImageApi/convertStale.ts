import chalk from "chalk";
import { IImageCacheRef, IImageRule } from "~/@types/image-types";
import { getProjectConfig } from "~/shared/config";
import { logger } from "~/shared/core";
import { emoji, wordWrap } from "~/shared/ui";
import { IImageApiOptions, IImageTools } from "../useImageApi";
import { checkCacheFreshness } from "./checkCacheFreshness";
import { refreshCache } from "./refreshCache";
import { createTsSupportFile } from "./createTsSupportFile";

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
  const config = getProjectConfig().image;

  // iterate over rules
  for (const [i, rule] of rules.entries()) {
    log.info(
      chalk`- checking rule {blue ${rule.name}} for stale source images [ {dim ${
        i + 1
      } {italic of} ${rules.length}} ]`
    );
    const { missing, outOfDate } = await checkCacheFreshness(tools.cache, rule);
    if (missing.length > 0) {
      log.whisper(
        chalk`{dim - there are {bold ${
          missing.length
        }} images not currently in the cache: {dim ${missing.join(", ")}}}`
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
      log.info(
        chalk`- ${emoji.party} all images in {blue ${rule.name}} are current; no work needed.`
      );
      log.info(chalk`{dim - if you need to force image production use {blue dd optimize --force}}`);
    } else {
      // freshen up rule
      await refreshCache(rule, tools, [...missing, ...outOfDate]);
      const changes = [...missing, ...outOfDate];
      const resized: Promise<IImageCacheRef[]>[] = [];
      for (const img of changes) {
        resized.push(tools.sharp.resizeToWebFormats(img, rule.destination, rule.widths));
      }
      const resizedComplete = [...(await Promise.all(resized))].flat();
      log.whisper(
        chalk`{dim - the following images were {italic resized}:\n${wordWrap(
          resizedComplete.map((i) => i.file).join("\t"),
          { wrapDistance: 120 }
        )}}\n`
      );
    }
  } // rules iteration
  if (config?.supportTS) {
    createTsSupportFile(rules, tools);
  }
}
