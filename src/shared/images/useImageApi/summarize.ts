import chalk from "chalk";
import { formatDistance } from "date-fns";
import { IImageCacheRef, IImageRule } from "src/@types/image-types";
import { logger } from "src/shared/core/logger";
import { emoji, wordWrap } from "src/shared/ui";
import { IImageTools } from "../useImageApi";

export function summarize(rules: IImageRule[], tools: IImageTools) {
  const log = logger();

  if (!tools.cache) {
    log.shout(
      `- ${emoji.eyeballs} there is no image cache; do you want to run {dd image convert} first?`
    );
  }
  if (!tools.cache.source) {
    console.log(
      wordWrap(
        `- ${emoji.eyeballs} there appears to be something wrong with your image cache as the cache file does exist but the "source" folder is missing. Please have a look but it is probably best that you re-build the cache with {blue dd image optimize --force}`
      )
    );
    process.exit();
  }

  const sourceImages = Object.keys(tools.cache.source).reduce((acc, i) => {
    acc = [...acc, tools.cache.source[i]];
    return acc;
  }, [] as IImageCacheRef[]);

  const convertedImages = Object.keys(tools.cache.converted).reduce((acc, i) => {
    acc = [...acc, tools.cache.converted[i]];
    return acc;
  }, [] as IImageCacheRef[]);

  const lastUpdate = formatDistance(
    sourceImages.reduce((mostRecent, i) => (i.modified > mostRecent ? i.modified : mostRecent), 0),
    Date.now(),
    { addSuffix: true }
  );
  log.info(`{bold Summary of Image Configuration}`);
  log.info(`{bold ------------------------------}\n`);

  log.info(`- there are ${chalk.yellow.bold(sourceImages.length)} source images in the cache`);
  log.info(`- the last detected change in these source images was ${lastUpdate}`);
  log.info(
    chalk.dim(` - the rules ${chalk.italic("plus")} source images have produced ${chalk.yellowBright(convertedImages.length)} optimized images})`)
  );

  log.info();
  log.info(`  Rule Overview:`);
  log.info(`  --------------`);

  for (const r of rules || []) {
    const sourceFromRule = sourceImages.filter((i) => i?.rule === r.name);
    const convertedFromRule = convertedImages.filter((i) => i?.rule === r.name);
    log.info(
      `    - ${r.name}: ${chalk.dim(" source: ")}${chalk.gray(r.source)}}${chalk.gray`"`}, destination: }${chalk.gray`"`}${r.destination}}${chalk.gray`"`}, glob: }${chalk.gray`"`}${r.glob}${chalk.gray`"`}, source images: ${sourceFromRule.length}, optimized images: ${convertedFromRule.length}`
    );
  }
}
