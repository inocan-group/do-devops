/* eslint-disable unicorn/no-await-expression-member */
import chalk from "chalk";
import { IImageCacheRef, IImageRule } from "src/@types/image-types";
import { getProjectConfig } from "src/shared/config";
import { logger } from "src/shared/core";
import { emoji, wordWrap } from "src/shared/ui";
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
      `- checking rule ${chalk.blue(rule.name)}} for stale source images [ ${chalk.dim(i + 1)} ${chalk.italic`of`} ${rules.length}} ]`
    );
    const { missing, outOfDate } = await checkCacheFreshness(tools.cache, rule);
    if (missing.length > 0) {
      log.whisper(
        chalk.dim`there are ${chalk.bold(missing.length)} images not currently in the cache: ${missing.join(", ")}`
      );
    }
    if (outOfDate.length > 0) {
      log.whisper(
        `- there are ${outOfDate.length} images who are out of date: ${chalk.dim(missing.join(
          ", "
        ))}`
      );
    }
    if (missing.length === 0 && outOfDate.length === 0) {
      log.info(
        `- ${emoji.party} all images in ${chalk.blue(rule.name)} are current; no work needed.`
      );
      log.info(chalk.dim`- if you need to force image production use ${chalk.blue`dd optimize --force`}`);
    } else {
      // freshen up rule
      await refreshCache(rule, tools, [...missing, ...outOfDate]);
      const changes = [...missing, ...outOfDate];
      const resized: Promise<IImageCacheRef[]>[] = [];
      for (const img of changes) {
        resized.push(
          tools.sharp.resizeToWebFormats(img, rule.destination, rule.widths, {
            ...rule.options,
            includePNG: rule.outputPNG,
          })
        );
      }
      const resizedComplete = (await Promise.all(resized)).flat();
      log.whisper(
        chalk.dim`- the following images were ${chalk.italic`resized`}:\n${wordWrap(
          resizedComplete.map((i) => i.file).join("\t"),
          { wrapDistance: 120 }
        )}\n`
      );
    }
  } // rules iteration
  if (config?.supportTS) {
    createTsSupportFile(rules, tools);
  }
}
