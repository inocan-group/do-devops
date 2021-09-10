import chalk from "chalk";
import { formatDistance } from "date-fns";
import { IImageCacheRef, IImageRule } from "~/@types/image-types";
import { logger } from "~/shared/core/logger";
import { IImageTools } from "../useImageApi";

export function summarize(rules: IImageRule[], tools: IImageTools) {
  const log = logger();
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
  log.info(chalk`{bold Summary of Image Configuration}`);
  log.info(chalk`{bold ------------------------------}\n`);

  log.info(chalk`- there are {yellow {bold ${sourceImages.length}}} source images in the cache`);
  log.info(chalk`- the last detected change in these source images was ${lastUpdate}`);
  log.info(
    chalk`{dim - the rules {italic plus} source images have produced {bold {yellow ${convertedImages.length}}} optimized images}`
  );

  log.info();
  log.info(chalk`  Rule Overview:`);
  log.info(chalk`  --------------`);

  for (const r of rules || []) {
    const sourceFromRule = sourceImages.filter((i) => i?.rule === r.name);
    const convertedFromRule = convertedImages.filter((i) => i?.rule === r.name);
    log.info(
      chalk`    - ${r.name}: {dim source: {gray "}${r.source}{gray "}, destination: {gray "}${r.destination}{gray "}, glob: {gray "}${r.glob}{gray "}, source images: ${sourceFromRule.length}, optimized images: ${convertedFromRule.length}}`
    );
  }
}
